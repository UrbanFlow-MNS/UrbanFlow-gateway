import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { PrometheusController } from './controllers/prometheus.controller';
import { UserController } from './controllers/user.controller';
import { LogsController } from './controllers/logs.controller';
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
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    PrometheusController,
    LogsController,
  ],
  providers: [
    AppService,
    JwtAuthGuard,
    PrometheusService,
    { provide: 'IPrometheusService', useClass: PrometheusService },
  ],
})
export class AppModule {}
