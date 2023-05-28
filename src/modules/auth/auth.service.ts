import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async validateUser(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }

    async validateUserByRefresh(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
