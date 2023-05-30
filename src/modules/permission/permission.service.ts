import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseData } from 'src/interfaces/response.interface';
import { PermissionCategoryService } from '../permission-category/permission-category.service';
import { Slug } from '../../common/slug';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly permissionCategoryService: PermissionCategoryService,
    ) {}

    async findOneBySlug(slug: string): Promise<Permission> {
        return this.permissionRepository.findOneBy({ slug });
    }
    async findOneByName(name: string): Promise<Permission> {
        return this.permissionRepository.findOneBy({ name });
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<ResponseData<Permission>> {
        const { idPermissionCategory, selectedActions } = createPermissionDto;

        const existsPermissionCategory = await this.permissionCategoryService.findOne(idPermissionCategory);
        if (!existsPermissionCategory) {
            throw new HttpException(`Permission category not found`, HttpStatus.NOT_FOUND);
        }

        const createdPermission: Permission[] = [];

        await Promise.all(
            selectedActions.map(async (action) => {
                const slug = Slug.slugify(existsPermissionCategory.name + '.' + action);
                const existsPermission = await this.findOneBySlug(slug);
                if (existsPermission === null) {
                    const permission: Permission = new Permission();
                    permission.name = (existsPermissionCategory.name + ' ' + action)
                        .split(' ')
                        .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
                        .join(' ');
                    permission.slug = slug;
                    permission.description = `This is ${permission.name} description`;
                    permission.permissionCategory = existsPermissionCategory;
                    createdPermission.push(permission);
                }
            }),
        );

        const savedPermissions = await this.permissionRepository.save(createdPermission);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Permission created successfully',
            data: savedPermissions,
        };
    }

    async findAll() {
        return `This action returns all permission`;
    }

    async findOne(id: number) {
        return `This action returns a #${id} permission`;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto) {
        return `This action updates a #${id} permission`;
    }

    async remove(id: number) {
        return `This action removes a #${id} permission`;
    }
}
