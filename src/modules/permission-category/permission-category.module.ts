import { Module } from '@nestjs/common';
import { PermissionCategoryService } from './permission-category.service';
import { PermissionCategoryController } from './permission-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionCategory } from './entities/permission-category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionCategory])],
    controllers: [PermissionCategoryController],
    providers: [PermissionCategoryService],
    exports: [PermissionCategoryService],
})
export class PermissionCategoryModule {}
