import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slug } from '../../common/slug';
import { ResponseData } from '../../interfaces/response.interface';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findOneBySlug(slug: string): Promise<Category> {
        return this.categoryRepository.findOne({
            where: {
                slug,
            },
            relations: {
                children: true,
                parent: true,
            },
        });
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<ResponseData<Category>> {
        const { name, description = `This is ${name} description`, parentId = null } = createCategoryDto;
        const slug = Slug.slugify(name);
        const existingCategory = await this.findOneBySlug(slug);
        if (existingCategory) {
            throw new HttpException('Category already exists', HttpStatus.CONFLICT);
        }
        const newCategory = new Category();
        newCategory.name = name;
        newCategory.slug = slug;
        newCategory.description = description;

        if (parentId) {
            const parentCategory = await this.findOne(parentId);
            if (!parentCategory) {
                throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
            }
            newCategory.parent = parentCategory;
        }

        const savedCategory = await this.categoryRepository.save(newCategory);
        return {
            data: savedCategory,
            message: 'Category created successfully',
            statusCode: HttpStatus.CREATED,
        };
    }

    getNameTable() {
        return this.categoryRepository.metadata.tableName;
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            relations: {
                children: true,
                parent: true,
            },
        });
        return this.buildCategoryTree(categories);
    }

    buildCategoryTree(categories: Category[]): Category[] {
        const categoryMap = new Map<number, Category>();
        const rootCategories: Category[] = [];

        // Tạo một bản đồ danh mục để truy cập nhanh
        categories.forEach((category) => {
            category.children = [];
            categoryMap.set(category.id, category);
        });

        // Xây dựng cây danh mục
        categories.forEach((category) => {
            if (category.parent) {
                const parentCategory = categoryMap.get(category.parent.id);
                if (parentCategory) {
                    parentCategory.children.push(category);
                }
            } else {
                rootCategories.push(category);
            }
        });

        return rootCategories;
    }

    async findOne(id: number): Promise<Category & { idsChild: number[] }> {
        const category = await this.categoryRepository.findOne({
            where: {
                id,
            },
            relations: {
                children: true,
                parent: true,
            },
        });
        const idsChild = category.children.map((child) => child.id);
        if (category.children) {
            for (const child of category.children) {
                const childCategory = await this.findOne(child.id);
                child.children = childCategory.children;
                idsChild.push(...childCategory.idsChild);
            }
        }
        return {
            ...category,
            idsChild,
        };
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ResponseData<Category>> {
        const existingCategory = await this.findOne(id);
        if (!existingCategory) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        const {
            name = existingCategory.name,
            description = existingCategory.description,
            parentId = existingCategory.parent.id,
        } = updateCategoryDto;
        const slug = Slug.slugify(name);
        const existingCategorySlug = await this.findOneBySlug(slug);
        if (existingCategorySlug && existingCategorySlug.id !== id) {
            throw new HttpException('Category already exists', HttpStatus.CONFLICT);
        }
        existingCategory.name = name;
        existingCategory.slug = slug;
        existingCategory.description = description;

        if (parentId) {
            if (parentId === existingCategory.id) {
                throw new HttpException('Parent category cannot be itself', HttpStatus.BAD_REQUEST);
            }
            const isChildren = this.checkIsChildren(parentId, existingCategory.idsChild);
            if (isChildren) {
                throw new HttpException('Parent category cannot be its child', HttpStatus.BAD_REQUEST);
            }

            const parentCategory = await this.findOne(parentId);
            if (!parentCategory) {
                throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
            }

            existingCategory.parent = parentCategory;
        }

        const savedCategory = await this.categoryRepository.save(existingCategory);
        return {
            data: savedCategory,
            message: 'Category updated successfully',
            statusCode: HttpStatus.OK,
        };
    }

    async remove(id: number) {
        const existingCategory = await this.findOne(id);
        if (!existingCategory) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        await this.categoryRepository.remove(existingCategory);
        return {
            message: 'Category removed successfully',
            statusCode: HttpStatus.OK,
        };
    }

    private checkIsChildren(parentId: number, idsChild: number[]): boolean {
        return idsChild.includes(parentId);
    }
}
