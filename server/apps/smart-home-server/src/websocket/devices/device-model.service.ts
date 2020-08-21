import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'socket.io';
import { LightRegisterActionInterface } from '../../interfaces/light/register-action.interface';
import { LightRegisterResponseInterface } from '../../interfaces/light/register-response.interface';
import * as uuid from 'uuid/v1';
import { DevicesStorageService } from '../../storage/devices-storage.service';
import {
  DeviceConnection,
  DeviceStorageAdapterInterface,
} from '../../interfaces/storage/device-storage-adapter.interface';
import { DeviceIdException } from '../../exceptions/device-id.exception';
import { LightDefaultActionInterface } from '../../interfaces/light/default-action.interface';
import { LightDateResponseInterface } from '../../interfaces/light/date-response.interface';
import { Connection } from 'nodejs-websocket';
import { DeviceAction } from '../../interfaces/light/action.type';
import { LightUpdateActionInterface } from '../../interfaces/light/update-action.interface';
import { ResponseInterface } from '../../interfaces/response-interface';
import { ApplicationsStorageService } from '../../storage/applications-storage.service';
import { NoClientMessageException } from '../../exceptions/no-client-message.exception';
import { DeviceService } from '../../database/services/device.service';

@Injectable()
export class DeviceModelService {
  @Inject(ApplicationsStorageService)
  protected applications: ApplicationsStorageService;

  @Inject(DevicesStorageService)
  protected storage: DeviceStorageAdapterInterface;

  @Inject(DeviceService)
  protected deviceDbService: DeviceService;

  protected logger = new Logger(DeviceModelService.name);

  public register(connection: Connection, data: LightRegisterActionInterface): LightRegisterResponseInterface {
    const apikey = uuid();

    this.checkDeviceId(data);

    const device: DeviceConnection = {
      deviceid: data.deviceid,
      conn: connection,
      sendMessages: new Map<string, any>(),
    };

    this.storage.add(device);

    this.deviceDbService.create(data.deviceid, data.model, apikey, data.model);
    this.addPongListener(connection, data.deviceid);

    const response = {
      error: 0,
      deviceid: data.deviceid,
      apikey,
    };

    return response;
  }

  public date(client: Connection, data: LightDefaultActionInterface): LightDateResponseInterface {
    this.checkDeviceId(data);

    const response = {
      error: 0,
      deviceid: data.deviceid,
      apikey: data.apikey,
      date: new Date().toISOString(),
    };

    client.sendText(JSON.stringify(response));

    return response;
  }

  async update(client: Client, data: LightUpdateActionInterface): Promise<ResponseInterface> {
    this.checkDeviceId(data);

    const deviceId = data.deviceid;

    const device = await this.deviceDbService.updateDevice(deviceId, data.params.switches, data.params.configure);

    const response = {
      error: 0,
      deviceid: deviceId,
      apikey: device.apikey,
    };

    const message = JSON.stringify({ action: 'app:update', deviceId, params: device.params.map(p => p.toJSON()) });

    this.applications.sendMessageToAll(message);

    return response;
  }

  public default(client: Client, data: any): ResponseInterface {
    this.checkDeviceId(data);

    const deviceId = data.deviceid;
    const response = {
      error: 0,
      deviceid: deviceId,
      apikey: data.apikey,
    };

    const sequence = data.sequence;

    if (sequence) {
      const device = this.storage.getOne(deviceId);

      if (device.sendMessages.has(sequence)) {
        device.sendMessages.delete(sequence);

      } else {
        this.logger.error(`REQ | WS | default | Can not find message ${sequence} in ${deviceId}.`);
        throw new NoClientMessageException(sequence);
      }
    }

    return response;
  }


  protected checkDeviceId(data: DeviceAction) {
    if (!data.deviceid) {
      throw new DeviceIdException();
    }
  }

  protected addPongListener(connection: Connection, deviceId: string) {
    connection.on('pong', () => {
      this.logger.log(`RES | WS | pong | Device ${deviceId} is connected`);
      this.deviceDbService.markDeviceAsConnected(deviceId);

      const all = this.applications.getAll();

      const message = JSON.stringify({ action: 'app:isConnected', deviceId, params: true });

      this.applications.sendMessageToAll(message);
    });
  }
}
