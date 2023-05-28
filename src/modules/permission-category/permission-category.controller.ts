import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionCategoryService } from './permission-category.service';
import { CreatePermissionCategoryDto } from './dto/create-permission-category.dto';
import { UpdatePermissionCategoryDto } from './dto/update-permission-category.dto';

@Controller('permission-category')
export class PermissionCategoryController {
  constructor(private readonly permissionCategoryService: PermissionCategoryService) {}

  @Post()
  create(@Body() createPermissionCategoryDto: CreatePermissionCategoryDto) {
    return this.permissionCategoryService.create(createPermissionCategoryDto);
  }

  @Get()
  findAll() {
    return this.permissionCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionCategoryDto: UpdatePermissionCategoryDto) {
    return this.permissionCategoryService.update(+id, updatePermissionCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionCategoryService.remove(+id);
  }
}
