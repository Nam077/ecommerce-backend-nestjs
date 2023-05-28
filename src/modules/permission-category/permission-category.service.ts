import { Injectable } from '@nestjs/common';
import { CreatePermissionCategoryDto } from './dto/create-permission-category.dto';
import { UpdatePermissionCategoryDto } from './dto/update-permission-category.dto';

@Injectable()
export class PermissionCategoryService {
  create(createPermissionCategoryDto: CreatePermissionCategoryDto) {
    return 'This action adds a new permissionCategory';
  }

  findAll() {
    return `This action returns all permissionCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionCategory`;
  }

  update(id: number, updatePermissionCategoryDto: UpdatePermissionCategoryDto) {
    return `This action updates a #${id} permissionCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissionCategory`;
  }
}
