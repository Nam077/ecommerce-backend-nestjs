import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { User } from '../modules/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
        return request.user;
    }
    return request.user && request.user[data];
});
export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): number => {
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    return +user.id;
});
