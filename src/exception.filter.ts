import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalGatewayExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      // Guards et exceptions HTTP locales (ForbiddenException, UnauthorizedException, etc.)
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
    } else if (isRpcError(exception)) {
      // Erreurs forwarded depuis les microservices via TCP
      status = exception.statusCode;
      message = exception.message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(`[ExceptionFilter] ${request.method} ${request.url} -> 500`, (exception as Error)?.stack ?? exception);
    }

    return response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }
}

function isRpcError(exception: unknown): exception is { statusCode: number; message: string } {
  if (typeof exception !== 'object' || exception === null) return false;
  const e = exception as Record<string, unknown>;
  if ('statusCode' in e && 'message' in e) return true;
  // HttpException sérialisée via TCP : a "status" au lieu de "statusCode"
  if ('status' in e && typeof e['status'] === 'number' && 'message' in e) {
    (e as any).statusCode = e['status'];
    return true;
  }
  return false;
}