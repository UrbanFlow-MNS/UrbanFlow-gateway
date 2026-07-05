import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AdminUserCityController } from './admin-user-city.controller';
import { UserGrpcModule } from '../../../shared/nestjs/user/user-grpc.module';
import { AdminUserCityGrpcModule } from '../../../shared/nestjs/user/admin-user-city-grpc.module';

@Module({
    imports: [
        UserGrpcModule,
        AdminUserCityGrpcModule,
    ],
    controllers: [UserController, AdminUserCityController],
    exports: [UserGrpcModule, AdminUserCityGrpcModule],
})

export class UserModule { }
