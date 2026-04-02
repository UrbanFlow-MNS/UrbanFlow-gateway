import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';                          
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { UserController } from './controllers/user.controller';
import { AgencyController } from './controllers/agency.controller';
import { CalendarController } from './controllers/calendar.controller';
import { RoutesController } from './controllers/routes.controller';
import { RouteTypeController } from './controllers/routetypes.controller';
import { StopsController } from './controllers/stops.controller';
import { TripController } from './controllers/trip.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PrometheusService } from './services/prometheus.service';
import { TripsHttpService } from './services/httpservice.service';    

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
        HttpModule,
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
        ]),
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        PrometheusController,
        AgencyController,
        CalendarController,
        RoutesController,
        RouteTypeController,
        StopsController,
        TripController,
    ],
    providers: [
        AppService,
        JwtAuthGuard,
        PrometheusService,
        TripsHttpService,                                             
        { provide: 'IPrometheusService', useClass: PrometheusService },
    ],
})
export class AppModule { }