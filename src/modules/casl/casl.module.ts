import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './factory/casl-ability.factory';

@Module({
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule {
    static forRoot(): typeof CaslModule {
        return CaslModule;
    }
}
