import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Action } from '../../casl/factory/casl-ability.factory';

export class CreatePermissionDto {
    // using class validator and swagger
    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty({
        message: 'Id is required',
    })
    @Type(() => Number)
    idPermissionCategory: number;

    @ApiProperty({
        enum: Action,
        isArray: true,
        example: Object.values(Action),
        name: 'selectedActions',
    })
    selectedActions: Action[];
}
