import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalGatewayExceptionFilter } from './exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins =
        process.env.CORS_ORIGINS?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) ?? [];
    const isDev = process.env.NODE_ENV !== 'production';
    const localhostPatterns = [
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
    ];
    const compiledOrigins = allowedOrigins.map((entry) => {
        if (entry.includes('*')) {
            const escaped = entry.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^.]+');
            return new RegExp(`^${escaped}$`);
        }
        return entry;
    });

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (isDev && localhostPatterns.some((re) => re.test(origin))) {
                callback(null, true);
                return;
            }
            const allowed = compiledOrigins.some((entry) =>
                entry instanceof RegExp ? entry.test(origin) : entry === origin,
            );
            if (allowed) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
    });

    app.setGlobalPrefix('api/');
    app.useGlobalFilters(new GlobalGatewayExceptionFilter());

    await app.listen(process.env.API_PORT ?? 3000);
}

bootstrap();
