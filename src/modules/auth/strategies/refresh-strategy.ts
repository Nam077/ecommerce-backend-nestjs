import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Inject, UnauthorizedException } from '@nestjs/common';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_REFRESH'),
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUserByRefresh(payload);
        if (!user) {
            throw new UnauthorizedException({ message: 'Unauthorized' });
        }
        return user;
    }
}
