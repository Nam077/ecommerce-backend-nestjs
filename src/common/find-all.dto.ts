import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDto {
    @ApiProperty({ example: 1, description: 'The page number' })
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiProperty({ example: 10, description: 'The number of items per page' })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    limit?: number;

    @ApiProperty({ example: 'John', description: 'The search keyword' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiProperty({ example: 'name', description: 'The field to sort by' })
    @IsString()
    @IsOptional()
    sort?: string;

    @ApiProperty({
        example: 'ASC',
        description: 'The sort order (ASC or DESC)',
        enum: ['ASC', 'DESC'],
    })
    @IsString()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}
