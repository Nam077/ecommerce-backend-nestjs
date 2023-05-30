import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionCategoryDto } from './dto/create-permission-category.dto';
import { UpdatePermissionCategoryDto } from './dto/update-permission-category.dto';
import { PermissionCategory } from './entities/permission-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ResponseData } from '../../interfaces/response.interface';
import { Slug } from '../../common/slug';
import { Pagination } from '../../interfaces/pagination.interface';
import { FindAllDto } from '../../common/find-all.dto';

@Injectable()
export class PermissionCategoryService {
    constructor(
        @InjectRepository(PermissionCategory)
        private readonly permissionCategoryRepository: Repository<PermissionCategory>,
    ) {}

    async findBySlug(slug: string): Promise<PermissionCategory> {
        return this.permissionCategoryRepository.findOneBy({ slug });
    }
    async create(createPermissionCategoryDto: CreatePermissionCategoryDto): Promise<ResponseData<PermissionCategory>> {
        const { name, description = `This is ${name} description` } = createPermissionCategoryDto;
        const existsPermissionCategory: PermissionCategory = await this.findBySlug(Slug.slugify(name));
        if (existsPermissionCategory) {
            throw new HttpException(`Permission category ${name} already exists`, HttpStatus.CONFLICT);
        }
        const permissionCategory: PermissionCategory = new PermissionCategory();
        permissionCategory.name = name;
        permissionCategory.slug = Slug.slugify(name);
        permissionCategory.description = description;
        const newPermissionCategory: PermissionCategory = await this.permissionCategoryRepository.save(
            permissionCategory,
        );
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Permission category created successfully',
            data: newPermissionCategory,
        };
    }

    getNameTable(): string {
        return this.permissionCategoryRepository.metadata.tableName;
    }

    async getCount(): Promise<number> {
        return this.permissionCategoryRepository.count();
    }

    async findAll(findAllDto: FindAllDto): Promise<Pagination<PermissionCategory>> {
        const { page = 1, limit = 10, sort, order, search } = findAllDto;
        const nameTable = this.getNameTable();
        const query = this.permissionCategoryRepository.createQueryBuilder(nameTable);
        if (search) {
            query.where(
                new Brackets((qb) => {
                    qb.where(`${nameTable}.name LIKE :search`, { search: `%${search}%` }).orWhere(
                        `${nameTable}.slug LIKE :search`,
                        { search: `%${search}%` },
                    );
                }),
            );
        }

        const totalCount = await this.getCount();

        if (sort && order) {
            query.orderBy(`user.${sort}`, order);
        }

        if (page) {
            query.skip((page - 1) * limit);
            query.take(limit);
        }
        query.select([`${nameTable}.id`, `${nameTable}.name`, `${nameTable}.slug`, `${nameTable}.description`]);
        const permissionCategories: PermissionCategory[] = await query.getMany();
        return {
            data: permissionCategories,
            count: permissionCategories.length,
            totalPage: Math.ceil(totalCount / limit),
            currentPage: page,
            perPage: limit,
            total: totalCount,
        };
    }

    async findOne(id: number): Promise<PermissionCategory> {
        return this.permissionCategoryRepository.findOne({
            where: { id },
            select: {
                createdAt: false,
                deletedAt: false,
                updatedAt: false,
            },
            relations: {
                permissions: true,
            },
        });
    }

    async update(
        id: number,
        updatePermissionCategoryDto: UpdatePermissionCategoryDto,
    ): Promise<ResponseData<PermissionCategory>> {
        const permissionCategory = await this.findOne(id);

        if (!permissionCategory) {
            throw new HttpException(`Permission category ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const newSlug = Slug.slugify(updatePermissionCategoryDto.name);

        if (newSlug !== permissionCategory.slug) {
            const existsPermissionCategory = await this.findBySlug(newSlug);

            if (existsPermissionCategory) {
                throw new HttpException(
                    `Permission category ${updatePermissionCategoryDto.name} already exists`,
                    HttpStatus.CONFLICT,
                );
            }
        }

        const updatedPermissionCategory = {
            ...updatePermissionCategoryDto,
            slug: newSlug,
        };

        await this.permissionCategoryRepository.update(id, updatedPermissionCategory);

        return {
            data: await this.findOne(id),
            statusCode: HttpStatus.OK,
            message: 'Permission category updated successfully',
        };
    }

    async remove(id: number) {
        const permissionCategory = await this.findOne(id);

        if (!permissionCategory) {
            throw new HttpException(`Permission category ${id} not found`, HttpStatus.NOT_FOUND);
        }

        await this.permissionCategoryRepository.softDelete(id);

        return {
            statusCode: HttpStatus.OK,
            message: 'Permission category deleted successfully',
        };
    }
}
