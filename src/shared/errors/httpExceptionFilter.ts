import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = (exceptionResponse as any).message;
    let detail = (exceptionResponse as any).detail;

    if (Array.isArray(message) && status === HttpStatus.BAD_REQUEST) {
      detail = message.join(' ');
    }

    response.status(status).json({
      message,
      detail,
    });
  }
}
