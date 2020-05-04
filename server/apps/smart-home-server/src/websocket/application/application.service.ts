import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Connection } from 'nodejs-websocket';
import { Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { ApplicationsStorageService } from '../../storage/applications-storage.service';
import { SmartWsAdapterService } from '../smart-ws-adapter/smart-ws-adapter.service';

@WebSocketGateway({ adapter: SmartWsAdapterService })
export class ApplicationService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected server: Server;

  protected logger = new Logger(this.constructor.name);

  @Inject(ApplicationsStorageService)
  protected storage: ApplicationsStorageService;

  @SubscribeMessage('app:register')
  public some(client: Connection, data: any): any {
    this.logger.log(`REQ | WS | some | ${JSON.stringify(data)}`);

    this.storage.add(client);

    return { event: 'app:register', error: 0 };
  }

  handleConnection(client: Connection, ...args: any[]): any {
    this.logger.warn(`REQ | WS | Connect | ${client.key}`);
  }

  handleDisconnect(client: Connection) {
    this.storage.remove(client.key);

    this.logger.warn(`REQ | WS | Disconnect | ${client.key}`);
  }
}
