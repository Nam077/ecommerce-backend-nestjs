import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        type: String,
        format: 'email',
        example: 'nvnfont@gmail.com',
    })
    @IsEmail({}, { message: 'Email is invalid' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
        example: '123456',
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
