import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId } from '../../decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RefreshGuard } from './guards/refresh.guard';
import { IsPublic } from '../../decorators/is-public.decorator';
import { AtGuard } from './guards/at.guard';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 201, description: 'Login successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @IsPublic()
    @UseGuards(RefreshGuard)
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh token' })
    @ApiResponse({ status: 201, description: 'Refresh token successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async refresh(@GetCurrentUser() user) {
        return this.authService.refresh(user.id, user.refreshToken);
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 201, description: 'Logout successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async logout(@GetCurrentUserId() id: number) {
        return this.authService.logout(id);
    }
}
