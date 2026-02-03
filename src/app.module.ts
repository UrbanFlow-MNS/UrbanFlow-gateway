import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.AUTH_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.AUTH_SERVICE_PORT || '4001'),
                },
            },
            {
                name: 'USER_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.USER_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.USER_SERVICE_PORT || '4001'),
                },
            }
        ]),
    ],
    controllers: [AppController, AuthController, UserController],
    providers: [AppService],
})
export class AppModule { }
