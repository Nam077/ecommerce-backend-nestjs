import { PartialType } from '@nestjs/swagger';
import { CreatePermissionCategoryDto } from './create-permission-category.dto';

export class UpdatePermissionCategoryDto extends PartialType(CreatePermissionCategoryDto) {}
