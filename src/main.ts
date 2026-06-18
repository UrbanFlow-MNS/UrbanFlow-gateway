import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalGatewayExceptionFilter } from './exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
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
