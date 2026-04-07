import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgencyController } from './controllers/agency.controller';
import { AuthController } from './controllers/auth.controller';
import { CalendarController } from './controllers/calendar.controller';
import { IncidentController } from './controllers/incident.controller';
import { LogsController } from './controllers/logs.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { RoutesController } from './controllers/routes.controller';
import { RouteTypeController } from './controllers/routetypes.controller';
import { StopsController } from './controllers/stops.controller';
import { TripController } from './controllers/trip.controller';
import { TripPlannerController } from './controllers/tripPlanner.controller';
import { UserController } from './controllers/user.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { TripHttpService } from './services/httpservice.service';
import { PrometheusService } from './services/prometheus.service';

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
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ || 'amqp://localhost:5672'],
          queue: 'LOGS_QUEUE',
          queueOptions: {
            durable: false,
          },
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
    PrometheusController,
    IncidentController,
    LogsController,
    AgencyController,
    CalendarController,
    RoutesController,
    RouteTypeController,
    StopsController,
    TripController,
    TripPlannerController,
  ],
  providers: [
    AppService,
    JwtAuthGuard,
    PrometheusService,
    TripHttpService,
    { provide: 'IPrometheusService', useClass: PrometheusService },
  ],
})
export class AppModule {}
