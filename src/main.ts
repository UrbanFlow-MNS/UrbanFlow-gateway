import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalGatewayExceptionFilter } from './exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') ?? [];

    app.enableCors({
        origin: (origin, callback) => {
            // En prod : uniquement les origines listées dans CORS_ORIGINS
            // En dev : tout localhost est autorisé
            const isLocalhost = !origin || /^http:\/\/localhost:\d+$/.test(origin);
            const isAllowed = allowedOrigins.includes(origin ?? '');
            if (isLocalhost || isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
    });

    app.setGlobalPrefix('api/');
    app.useGlobalFilters(new GlobalGatewayExceptionFilter());

    await app.listen(process.env.API_PORT ?? 3000);
}

bootstrap();
