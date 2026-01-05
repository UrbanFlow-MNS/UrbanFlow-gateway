import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomError } from './models/custom-error.model';

@Catch()
export class GlobalGatewayExceptionFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.status

    return response
            .status(status)
            .json(
                {
                    statusCode: status,
                    message: exception.message,
                    path: request.url,
                }
            )
  }
}