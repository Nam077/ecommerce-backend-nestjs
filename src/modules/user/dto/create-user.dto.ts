import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Capitalize, Lowercase } from '../../../decorators/custom-validate.decorator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The email of the user',
        type: String,
        format: 'email',
        example: 'nvnfont@gmail.com',
    })
    @IsEmail({}, { message: 'Email is invalid' })
    @IsNotEmpty({ message: 'Email is required' })
    @Lowercase()
    @Matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
        message: 'Email is invalid',
    })
    email: string;

    @ApiProperty({
        description: 'The name of the user',
        type: String,
        example: 'Nguyen Van Nam',
    })
    @IsNotEmpty({ message: 'Name is required' })
    @Length(6, 255, { message: 'Name must be between 6 and 255 characters' })
    @Capitalize()
    name: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
        example: '123456',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
}
