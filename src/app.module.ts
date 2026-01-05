import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.AUTH_SERVICE_HOST || 'localhost',
                    port: parseInt(process.env.AUTH_SERVICE_PORT || '4001'),
                },
            }
        ]),
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule { }
