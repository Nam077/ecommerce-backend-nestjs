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
        const { name, description = `This is ${name} description`, parentId = 0 } = createCategoryDto;
        const slug = Slug.slugify(name);
        const existingCategory = await this.findOneBySlug(slug);
        if (existingCategory) {
            throw new HttpException('Category already exists', HttpStatus.CONFLICT);
        }
        const newCategory = new Category();
        newCategory.name = name;
        newCategory.slug = slug;
        newCategory.description = description;

        if (parentId !== 0) {
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

    async findAll() {
        return `This action returns all category`;
    }

    async findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({
            where: {
                id,
            },
            relations: {
                children: true,
                parent: true,
            },
        });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    async remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
