import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    async validateUser(payload: JwtPayload) {
        return await this.userService.validateUser(payload);
    }

    async generateAccessToken(user: User) {
        const payload = { username: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                // Hết hạn trong 1 giờ
                expiresIn: 60 * 60,
                secret: this.configService.get('JWT_SECRET_AUTH'),
            }),
        };
    }

    async generateRefreshToken(user: User) {
        const payload = { username: user.email, sub: user.id };
        const refreshToken = await this.jwtService.signAsync(payload, {
            // Hết hạn trong 30 ngày
            expiresIn: 60 * 60 * 24 * 30,
            secret: this.configService.get('JWT_SECRET_REFRESH'),
        });
        await this.userService.updateRefreshToken(user.id, refreshToken);
        return {
            refresh_token: refreshToken,
        };
    }

    async login(loginDto: LoginDto): Promise<
        | {
              access_token: string;
              refresh_token: string;
          }
        | string
    > {
        const user = await this.userService.login(loginDto);
        if (!user) {
            return 'Email or password is incorrect';
        }
        return {
            ...(await this.generateAccessToken(user)),
            ...(await this.generateRefreshToken(user)),
        };
    }

    async refresh(userId: number, refreshToken: string) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            return new ForbiddenException({ message: 'Invalid token' });
        }
        if (user.refreshToken !== refreshToken) {
            return new ForbiddenException({ message: 'Invalid token' });
        }
        return {
            ...(await this.generateAccessToken(user)),
        };
    }

    async logout(id: number): Promise<string> {
        await this.userService.updateRefreshToken(id, null);
        return 'Logout successfully';
    }
}
