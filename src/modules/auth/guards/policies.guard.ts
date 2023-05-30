import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../../casl/factory/casl-ability.factory';
import { UserService } from '../../user/user.service';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../../../decorators/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        @Inject(UserService) private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];
        const { user } = context.switchToHttp().getRequest();
        const userPermissions = await this.userService.getPermissions(user.id);
        const ability = this.caslAbilityFactory.createForUser(user, userPermissions);
        return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
    }
    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
