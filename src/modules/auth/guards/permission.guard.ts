import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { user } = context.switchToHttp().getRequest();
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!permissions) {
            return true;
        }
        if (!user) {
            return false;
        }
        return user.permissions.some((permission: string) => {
            return !!permissions.find((item: string) => item === permission);
        });
    }
}
