import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AdminUserController } from './admin-user.controller';
import { UserGrpcModule } from '../../../shared/nestjs/user/user-grpc.module';
import { AdminUserGrpcModule } from '../../../shared/nestjs/user/admin-user-grpc.module';

@Module({
    imports: [
        UserGrpcModule,
        AdminUserGrpcModule,
    ],
    controllers: [UserController, AdminUserController],
    exports: [UserGrpcModule, AdminUserGrpcModule],
})

export class UserModule { }
