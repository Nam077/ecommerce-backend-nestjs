import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Category Name',
        description: 'Name of the category',
        maxLength: 255,
    })
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        example: 'Category description',
        description: 'Description of the category',
        required: false,
    })
    @IsOptional()
    description: string;

    @ApiProperty({
        example: null,
        description: 'Parent ID of the category',
        required: false,
        default: null,
        type: Number,
    })
    @IsOptional()
    parentId: number;
}
