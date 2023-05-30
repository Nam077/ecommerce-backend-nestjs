import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleHandlePermissionDto {
    @ApiProperty({
        enum: ['add', 'remove'],
        example: 'add',
        name: 'action',
    })
    @IsNotEmpty({
        message: 'Action is required',
    })
    action: 'add' | 'remove';

    @ApiProperty({
        example: [1, 2],
        name: 'permissionIds',
        description: 'List of permission id',
        isArray: true,
        type: [Number],
    })
    @IsNotEmpty({
        message: 'Permission ids is required',
    })
    permissionIds: number[];
}
