import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { NotificationController } from './controllers/notification.controller';

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
            },
            {
                name: 'NOTIFICATION_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.NOTIFICATION_SERVICE_PORT || '4007'),
                },
            }
        ]),
    ],
    controllers: [AppController, AuthController, UserController, NotificationController],
    providers: [AppService],
})
export class AppModule { }
