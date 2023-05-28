import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './strategies/auth-strategy';
import { RefreshStrategy } from './strategies/refresh-strategy';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, AuthStrategy, RefreshStrategy],
})
export class AuthModule {}
