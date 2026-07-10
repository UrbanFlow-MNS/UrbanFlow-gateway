import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalGatewayExceptionFilter } from './exception.filter';

async function bootstrap() {
    const authInternalSecret = process.env.AUTH_INTERNAL_SECRET;
    if (!authInternalSecret) {
        throw new Error("AUTH_INTERNAL_SECRET is not defined.");
    }

    const userInternalSecret = process.env.USER_INTERNAL_SECRET;
    if (!userInternalSecret) {
        throw new Error("USER_INTERNAL_SECRET is not defined.");
    }

    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:10005',
            'http://localhost:10000',
            'https://urbanflow.lazyy.fr',
            'https://auth.urbanflow.lazyy.fr',
            'https://monitoring.urbanflow.lazyy.fr',
        ].filter(Boolean),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    app.setGlobalPrefix('api/');
    app.useGlobalFilters(new GlobalGatewayExceptionFilter());

    await app.listen(process.env.API_PORT ?? 3000);
}

bootstrap();
