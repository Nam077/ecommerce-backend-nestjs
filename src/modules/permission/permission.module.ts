import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionCategoryModule } from '../permission-category/permission-category.module';

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), PermissionCategoryModule],
    controllers: [PermissionController],
    providers: [PermissionService],
})
export class PermissionModule {}
