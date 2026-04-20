import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminUserCityController } from './controllers/admin-user-city.controller';
import { AgencyController } from './controllers/agency.controller';
import { AuthController } from './controllers/auth.controller';
import { CalendarController } from './controllers/calendar.controller';
import { CategoryController } from './controllers/category.controller';
import { IncidentController } from './controllers/incident.controller';
import { InterventionController } from './controllers/intervention.controller';
import { LogsController } from './controllers/logs.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { RoutesController } from './controllers/routes.controller';
import { RouteTypesController } from './controllers/routetype.controller';
import { RouteTypeController } from './controllers/routetypes.controller';
import { SiteController } from './controllers/site.controller';
import { StopsController } from './controllers/stops.controller';
import { TripController } from './controllers/trip.controller';
import { TripPlannerController } from './controllers/tripPlanner.controller';
import { UserController } from './controllers/user.controller';
import { VehiclesController } from './controllers/vehicle.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { TripHttpService } from './services/httpservice.service';
import { PrometheusService } from './services/prometheus.service';
import { TmHttpService } from './services/tmHttp.service';
import { TripPlannerHttpService } from './services/tripPlannerHttp.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
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
            {
                name: 'INCIDENTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.INCIDENT_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.INCIDENT_SERVICE_PORT || '6004'),
                },
            },
            {
                name: 'LOGS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.LOGS_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.LOGS_SERVICE_PORT || '6002'),
                },
            },
            {
                name: 'MONITORING_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.MONITORING_SERVICE_HOST || 'localhost',
                    port: Number.parseInt(process.env.MONITORING_SERVICE_PORT || '4005'),
                },
            },
        ]),
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        AdminUserCityController,
        PrometheusController,
        InterventionController,
        IncidentController,
        SiteController,
        CategoryController,
        LogsController,
        AgencyController,
        CalendarController,
        RoutesController,
        RouteTypeController,
        StopsController,
        TripController,
        TripPlannerController,
        RouteTypesController,
        VehiclesController
    ],
    providers: [
        AppService,
        JwtAuthGuard,
        RolesGuard,
        PrometheusService,
        TripHttpService,
        TmHttpService,
        TripPlannerHttpService,
        { provide: 'IPrometheusService', useClass: PrometheusService },
    ],
})
export class AppModule {}
