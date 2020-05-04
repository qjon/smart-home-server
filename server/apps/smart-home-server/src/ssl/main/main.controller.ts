import { Controller, HttpCode, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { ResponseInterface } from '../../interfaces/response-interface';
import { environment } from '../../../environments';
import { Request } from 'express';

export interface IWebSocketConfigResponse extends ResponseInterface {
  reason: string;
  IP: string;
  port: number;
}

@Controller('dispatch')
export class MainController {
  protected logger = new Logger(MainController.name);

  @Post('device')
  @HttpCode(HttpStatus.OK)
  public getWebSocketsInfo(@Req() request: Request): any {
    this.logger.log(`REQ | SSL | ${request.method} | ${request.url}`);

    const response: any = {
      error: 0,
      reason: 'ok',
      IP: environment.ip,
      port: environment.websocketsPort,
    };

    this.logger.log(`RES | SSL | ${request.method} | ${JSON.stringify(response)}`);
    return response;
  }
}
