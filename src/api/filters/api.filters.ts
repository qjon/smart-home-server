import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { DeviceNotConnectedException } from '../../exceptions/device-not-connected.exception';
import { Request, Response } from 'express';
import { DeviceIdException } from '../../exceptions/device-id.exception';

@Catch(DeviceNotConnectedException, DeviceIdException)
export class ApiExceptionFilters implements ExceptionFilter<HttpException> {
  protected logger = new Logger(ApiExceptionFilters.name);

  public catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(`Exception: ${exception.constructor.name} - ${exception.message}`);

    return response
      .status(status)
      .json({
        message: exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }

}
