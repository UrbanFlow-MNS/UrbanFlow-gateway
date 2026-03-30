import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { IncidentController } from './controllers/incident.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { UserController } from './controllers/user.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PrometheusService } from './services/prometheus.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
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
                name: 'INCIDENTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.INCIDENT_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.INCIDENT_SERVICE_PORT || '6004'),
                },
            }
        ]),
    ],
    controllers: [AppController, AuthController, UserController, PrometheusController, IncidentController],
    providers: [
        AppService,
        JwtAuthGuard,
        PrometheusService,
        { provide: 'IPrometheusService', useClass: PrometheusService },
    ],
})
export class AppModule { }
