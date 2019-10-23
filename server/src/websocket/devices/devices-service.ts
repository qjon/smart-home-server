import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { LightRegisterActionInterface } from '../../interfaces/light/register-action.interface';
import { LightRegisterResponseInterface } from '../../interfaces/light/register-response.interface';
import { LightDefaultActionInterface } from '../../interfaces/light/default-action.interface';
import { LightDateResponseInterface } from '../../interfaces/light/date-response.interface';
import { LightUpdateActionInterface } from '../../interfaces/light/update-action.interface';
import { ResponseInterface } from '../../interfaces/response-interface';
import { Connection } from 'nodejs-websocket';
import { Inject, Logger } from '@nestjs/common';
import { SmartWsAdapterService } from '../smart-ws-adapter/smart-ws-adapter.service';
import { WebsocketDeviceErrorResponse } from '../responses/websocket-device-error-response';
import { DeviceModelService } from './device-model.service';

@WebSocketGateway({ adapter: SmartWsAdapterService })
export class DevicesService {
  @WebSocketServer()
  public server: Server;

  @Inject(DeviceModelService)
  protected deviceModel: DeviceModelService;

  protected logger = new Logger(this.constructor.name);

  @SubscribeMessage('register')
  public register(connection: Connection, data: LightRegisterActionInterface): LightRegisterResponseInterface {
    this.logger.log(`REQ | WS | register | ${JSON.stringify(data)}`);

    try {
      const response = this.deviceModel.register(connection, data);

      this.logger.log(`RES | WS | register | ${JSON.stringify(response)}`);


      return response;
    } catch (e) {
      this.logger.error(`RES | WS | register | ${JSON.stringify(e.message)}`);
      return new WebsocketDeviceErrorResponse(e.message, data.apikey, data.deviceid);
    }
  }

  @SubscribeMessage('date')
  public date(client: Connection, data: LightDefaultActionInterface): LightDateResponseInterface | WebsocketDeviceErrorResponse {
    this.logger.log(`REQ | WS | date | ${JSON.stringify(data)}`);

    try {
      const response = this.deviceModel.date(client, data);

      this.logger.log(`RES | WS | date | ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      this.logger.error(`RES | WS | date | ${JSON.stringify(e.message)}`);
      return new WebsocketDeviceErrorResponse(e.message, data.apikey, data.deviceid);
    }
  }

  @SubscribeMessage('update')
  async update(client: Client, data: LightUpdateActionInterface): Promise<ResponseInterface> {
    this.logger.log(`REQ | WS | update | ${JSON.stringify(data)}`);

    try {
      const response = await this.deviceModel.update(client, data);

      this.logger.log(`RES | WS | update | ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      this.logger.error(`RES | WS | update | ${JSON.stringify(e.message)}`);
      return new WebsocketDeviceErrorResponse(e.message, data.apikey, data.deviceid);
    }
  }

  @SubscribeMessage('default')
  public default(client: Client, data: any): ResponseInterface {
    this.logger.log(`REQ | WS | default | ${JSON.stringify(data)}`);

    try {
      const response = this.deviceModel.default(client, data);

      this.logger.log(`RES | WS | default | ${JSON.stringify(response)}`);

      return response;
    } catch (e) {
      this.logger.error(`RES | WS | default | ${JSON.stringify(e.message)}`);
      return new WebsocketDeviceErrorResponse(e.message, data.apikey, data.deviceid);
    }
  }
}
