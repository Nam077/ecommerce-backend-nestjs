import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { PermissionCategoryModule } from './modules/permission-category/permission-category.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
        DatabaseModule,
        UserModule,
        RoleModule,
        PermissionModule,
        PermissionCategoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
