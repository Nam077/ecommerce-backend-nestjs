import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../../interfaces/jwt-payload.interface';
import { Request } from 'express';
export interface JwtRefreshPayload extends JwtPayload {
    refreshToken: string;
}
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_REFRESH'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload): Promise<JwtRefreshPayload> {
        const refreshToken = await this.extractRefreshTokenFromHeader(req);
        console.log('vô');
        return { ...payload, refreshToken };
    }
    async extractRefreshTokenFromHeader(req: Request): Promise<string> {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException({ message: 'Unauthorized' });
        }
        const bearerToken = authHeader.split(' ')[1];
        if (!bearerToken) {
            throw new UnauthorizedException({ message: 'Unauthorized' });
        }
        return bearerToken;
    }
}
