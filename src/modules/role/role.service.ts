import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PermissionService } from '../permission/permission.service';
import { Slug } from '../../common/slug';
import { ResponseData } from '../../interfaces/response.interface';
import { FindAllDto } from '../../common/find-all.dto';
import { RoleHandlePermissionDto } from './dto/role-handle-permission.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly permissionService: PermissionService,
    ) {}

    async findBySlug(slug: string) {
        return this.roleRepository.findOneBy({ slug });
    }
    async create(createRoleDto: CreateRoleDto): Promise<ResponseData<Role>> {
        const { name, description = `This is ${name} description` } = createRoleDto;
        const slug = Slug.slugify(name);
        const existsRole = await this.findBySlug(slug);
        if (existsRole) {
            throw new HttpException(`Role already exists`, HttpStatus.CONFLICT);
        }
        const role: Role = new Role();
        role.name = name;
        role.slug = slug;
        role.description = description;
        if (createRoleDto.permissions) {
            role.permissions = await this.permissionService.findByIds(createRoleDto.permissions);
        }
        const savedRole = await this.roleRepository.save(role);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Role created successfully',
            data: savedRole,
        };
    }
    getNameTable() {
        return this.roleRepository.metadata.tableName;
    }
    async getCount(): Promise<number> {
        return this.roleRepository.count();
    }
    async findAll(findAllDto: FindAllDto) {
        const { page = 1, limit = 10, sort, order, search } = findAllDto;
        const nameTable = this.getNameTable();
        const query = this.roleRepository.createQueryBuilder(nameTable);

        // Áp dụng điều kiện tìm kiếm nếu có
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

        // Đếm tổng số lượng người dùng
        const totalCount = await this.getCount();

        // Áp dụng sắp xếp nếu có
        if (sort && order) {
            query.orderBy(`${nameTable}.${sort}`, order);
        }

        // Áp dụng phân trang
        if (page) {
            query.skip((page - 1) * limit);
            query.take(limit);
        }
        // không lấy password
        query.select([`${nameTable}.id`, `${nameTable}.name`, `${nameTable}.slug`, `${nameTable}.description`]);
        // relation với role
        // Lấy danh sách người dùng
        const roles = await query.getMany();

        return {
            data: roles,
            currentPage: page,
            perPage: limit,
            count: roles.length,
            totalPage: Math.ceil(totalCount / limit),
            total: totalCount,
        };
    }

    async findOne(id: number) {
        return this.roleRepository.findOne({
            where: { id },
            relations: { permissions: true },
        });
    }

    async addPermission(id: number, permissions: number[]): Promise<ResponseData<Role>> {
        const role: Role = await this.findOne(id);

        if (!role) {
            throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
        }

        let idExistsPermissions: Set<number> = new Set(role.permissions.map((p) => p.id));
        idExistsPermissions = new Set([...idExistsPermissions, ...permissions]);

        role.permissions = await this.permissionService.findByIds([...idExistsPermissions]);

        await this.roleRepository.save(role);

        return {
            data: await this.findOne(id),
            statusCode: HttpStatus.OK,
            message: 'Permission added successfully',
        };
    }

    async removePermission(id: number, permissions: number[]): Promise<ResponseData<Role>> {
        const role = await this.findOne(id);

        if (!role) {
            throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const idExistsPermissions: Set<number> = new Set(role.permissions.map((p) => p.id));
        permissions.forEach((p) => idExistsPermissions.delete(p));

        role.permissions = await this.permissionService.findByIds([...idExistsPermissions]);

        await this.roleRepository.save(role);

        return {
            data: await this.findOne(id),
            statusCode: HttpStatus.OK,
            message: 'Permission removed successfully',
        };
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        const role = await this.findOne(id);

        if (!role) {
            throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const newSlug = Slug.slugify(updateRoleDto.name);

        if (newSlug !== role.slug) {
            const existsPermissionCategory = await this.findBySlug(newSlug);

            if (existsPermissionCategory) {
                throw new HttpException(`Role${updateRoleDto.name} already exists`, HttpStatus.CONFLICT);
            }
        }
        if (updateRoleDto.permissions) {
            role.permissions = await this.permissionService.findByIds(updateRoleDto.permissions);
        }
        const updatedRole: Role = {
            ...role,
            slug: newSlug,
        };

        await this.roleRepository.update(id, updatedRole);

        return {
            data: await this.findOne(id),
            statusCode: HttpStatus.OK,
            message: 'Permission category updated successfully',
        };
    }

    async remove(id: number) {
        const role = await this.findOne(id);

        if (!role) {
            throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
        }

        await this.roleRepository.delete(id);

        return {
            statusCode: HttpStatus.OK,
            message: 'Permission category deleted successfully',
        };
    }

    async handlePermission(number: number, handlePermissionDto: RoleHandlePermissionDto): Promise<ResponseData<Role>> {
        const { permissionIds, action } = handlePermissionDto;
        const role = await this.findOne(number);
        if (!role) {
            throw new HttpException(`Role ${number} not found`, HttpStatus.NOT_FOUND);
        }
        if (action === 'add') {
            return this.addPermission(number, permissionIds);
        }
        if (action === 'remove') {
            return this.removePermission(number, permissionIds);
        }
    }
}
