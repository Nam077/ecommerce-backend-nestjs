import { Module } from '@nestjs/common';
import { PermissionCategoryService } from './permission-category.service';
import { PermissionCategoryController } from './permission-category.controller';

@Module({
  controllers: [PermissionCategoryController],
  providers: [PermissionCategoryService]
})
export class PermissionCategoryModule {}
