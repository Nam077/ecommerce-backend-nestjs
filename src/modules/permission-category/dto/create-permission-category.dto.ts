import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionCategoryDto {
    @ApiProperty({
        description: 'Name of permission category',
        example: 'User',
        name: 'name',
    })
    @IsNotEmpty({
        message: 'Name is required',
    })
    @IsString({
        message: 'Name must be string',
    })
    name: string;

    @ApiProperty({
        description: 'Description of permission category',
        example: 'User',
        name: 'description',
    })
    @IsOptional()
    @IsString({
        message: 'Description must be string',
    })
    description: string;
}
