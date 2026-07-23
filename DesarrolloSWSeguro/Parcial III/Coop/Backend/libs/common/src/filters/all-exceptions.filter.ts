import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Context check for microservices (TCP/Redis) vs HTTP
    if (!httpAdapter) {
      this.logger.error(`Microservice Exception: ${exception}`);
      return;
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const errorDetails = exceptionResponse && typeof exceptionResponse === 'object'
      ? (exceptionResponse as any).message || (exceptionResponse as any).error || (exception instanceof Error ? exception.message : String(exception))
      : exception instanceof Error ? exception.message : String(exception);

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      error: errorDetails,
    };

    // Log the exception
    this.logger.error(
      `HTTP Error [${httpStatus}] at ${httpAdapter.getRequestUrl(request)} - IP: ${request.ip} - UserAgent: ${request.get?.('user-agent')}`,
      exception instanceof Error ? exception.stack : '',
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
