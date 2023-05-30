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
        const tableName = this.getNameTable(); // Lấy tên bảng từ hàm getNameTable()

        // Tạo truy vấn sử dụng createQueryBuilder()
        return this.categoryRepository
            .createQueryBuilder(tableName)
            .leftJoinAndSelect(`${tableName}.children`, 'children') // Kết hợp bảng "children"
            .leftJoinAndSelect(`children.children`, 'subChildren') // Kết hợp bảng "subChildren" (danh mục con của danh mục con)
            .where(`${tableName}.parent IS NULL`) // Lọc danh mục gốc (có parent là NULL)
            .orderBy(`${tableName}.id, children.id, subChildren.id`) // Sắp xếp kết quả theo thứ tự id của danh mục và danh mục con
            .getMany();
    }

    async findOne(id: number): Promise<Category> {
        const tableName = this.getNameTable();

        return this.categoryRepository
            .createQueryBuilder(tableName)
            .leftJoinAndSelect(`${tableName}.children`, 'children')
            .leftJoinAndSelect(`children.children`, 'subChildren')
            .where(`${tableName}.id = :id`, { id }) // Lọc danh mục theo ID
            .getOne();
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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

            const parentCategory = await this.findOne(parentId);
            // Kiểm tra xem danh mục cha có là danh mục con của danh mục hiện tại hay không

            if (!parentCategory) {
                throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
            }
            const isChildren = this.checkIsChildren(parentCategory, existingCategory);
            if (isChildren) {
                throw new HttpException('Parent category cannot be its child', HttpStatus.BAD_REQUEST);
            }

            existingCategory.parent = parentCategory;
        }

        // const savedCategory = await this.categoryRepository.save(existingCategory);
        return {
            data: null,
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

    private checkIsChildren(parentCategory: Category, existingCategory: Category): boolean {
        if (existingCategory.id === parentCategory.id) {
            // Nếu ID của parentCategory trùng khớp với ID của existingCategory
            // tức là parentCategory là con của existingCategory
            return true;
        }
        if (!existingCategory.children) {
            return false;
        }
        if (existingCategory.children) {
            for (const childCategory of existingCategory.children) {
                if (this.checkIsChildren(parentCategory, childCategory)) {
                    // Nếu tìm thấy parentCategory là con của một danh mục con của existingCategory
                    return true;
                }
            }
        }
        return false;
    }
}
