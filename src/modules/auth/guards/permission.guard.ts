import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject(UserService) private readonly userService: UserService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        const { allPermissions } = await this.userService.getRolesPermissions(user.id);
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
        const subject = this.reflector.get<string>('subject', context.getHandler());
        if (!permissions) {
            return true;
        }
        if (!user) {
            return false;
        }
        const hasSuperPermission = allPermissions.some((permission) => permission === 'superadmin');
        if (hasSuperPermission) {
            return true;
        }
        const hasAllPermissionForSubject = allPermissions.some((permission) => permission === `${subject}:manager`);
        const hasPermission = permissions.some((requiredPermission) => allPermissions.includes(requiredPermission));
        if (hasAllPermissionForSubject || hasPermission) {
            return true;
        }

        throw new ForbiddenException('Forbidden resource');
    }
}
