import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './factory/casl-ability.factory';

@Module({
    imports: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
