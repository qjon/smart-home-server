import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { DeviceStorageAdapterInterface } from '../../interfaces/storage/device-storage-adapter.interface';
import { DevicesStorageService } from '../../storage/devices-storage.service';

export abstract class AbstractWebsocketService {
  @WebSocketServer()
  server: Server;

  protected logger = new Logger(this.constructor.name);

  @Inject(DevicesStorageService)
  protected storage: DeviceStorageAdapterInterface;
}
