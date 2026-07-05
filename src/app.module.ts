import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminUserCityController } from './user/admin-user-city.controller';
import { AgencyController } from './controllers/agency.controller';
import { CalendarController } from './controllers/calendar.controller';
import { CategoryController } from './controllers/category.controller';
import { IncidentController } from './controllers/incident.controller';
import { InterventionController } from './controllers/intervention.controller';
import { LogsController } from './controllers/logs.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { PrometheusProxyController } from './controllers/prometheusProxy.controller';
import { RoutesController } from './controllers/routes.controller';
import { RouteTypesController } from './controllers/routetype.controller';
import { SiteController } from './controllers/site.controller';
import { StopsController } from './controllers/stops.controller';
import { TripController } from './controllers/trip.controller';
import { TripPlannerController } from './controllers/tripPlanner.controller';
import { VehiclesController } from './controllers/vehicle.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { TripHttpService } from './services/httpservice.service';
import { PrometheusService } from './services/prometheus.service';
import { PrometheusProxyService } from './services/prometheusProxy.service';
import { TmHttpService } from './services/tmHttp.service';
import { TripPlannerHttpService } from './services/tripPlannerHttp.service';
import { MonitoringController } from './controllers/monitoring.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AgencyGrpcModule } from '../../shared/nestjs/user/agency-grpc.module';

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
        AuthModule,
        UserModule,
        AgencyGrpcModule,
        ClientsModule.register([
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
        AgencyController,
        PrometheusController,
        PrometheusProxyController,
        InterventionController,
        IncidentController,
        SiteController,
        CategoryController,
        LogsController,
        MonitoringController,
        CalendarController,
        RoutesController,
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
        PrometheusProxyService,
        TripHttpService,
        TmHttpService,
        TripPlannerHttpService,
        { provide: 'IPrometheusService', useClass: PrometheusService },
    ],
})
export class AppModule {}
