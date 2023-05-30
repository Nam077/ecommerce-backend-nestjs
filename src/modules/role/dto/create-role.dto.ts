import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
    @IsNotEmpty({
        message: 'Name is required',
    })
    @IsString({
        message: 'Name must be string',
    })
    @ApiProperty({
        example: 'admin',
        name: 'name',
        description: 'Name of role',
    })
    name: string;

    @IsOptional()
    @IsString({
        message: 'Description must be string',
    })
    @ApiProperty({
        example: 'Administrator',
        name: 'description',
        description: 'Description of role',
    })
    description: string;

    @IsOptional()
    @ApiProperty({
        example: [1, 2],
        name: 'permissions',
        description: 'List of permission id',
        isArray: true,
        type: [Number],
    })
    permissions: number[];
}
