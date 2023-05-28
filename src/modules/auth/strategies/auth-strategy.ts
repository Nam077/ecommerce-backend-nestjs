import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type PayloadJwt = {
    sub: string;
    username: string;
};
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_AUTH'),
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
