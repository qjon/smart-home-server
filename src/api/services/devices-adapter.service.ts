import { Injectable, Logger } from '@nestjs/common';
import {
  BaseRequestDataInterface,
  DeviceAdapterInterface,
  UpdateSwitchStateDataInterface,
} from './device-adapter.interface';
import * as http from 'http';
import { SonOffEncryptionService } from '../../workers/sonoff-encryption.service';

@Injectable()
export class DevicesAdapterService implements DeviceAdapterInterface {
  private sonOffEncryptionService = new SonOffEncryptionService();

  private logger = new Logger(this.constructor.name);

  public updateSwitches(data: UpdateSwitchStateDataInterface): void {
    this.makeRequest(data, JSON.stringify({ switches: data.data }));
  }

  private makeRequest(requestData: BaseRequestDataInterface, data: string): void {
    const iv = 'w6j+aRi5VegzwNgXUxdqyw==';

    const request = http.request({
      host: requestData.host,
      port: requestData.port,
      path: requestData.path,
      method: requestData.method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
      },
    }, (res) => {
      console.log('ABC', res);
    });

    request.on('error', (e) => {
      console.log('error', e.message);
    });

    const value = {
      'sequence': '1570529155',
      'deviceid': requestData.deviceId,
      'selfApiKey': '123',
      'data': this.sonOffEncryptionService.encrypt(data, iv, requestData.apiKey),
      'encrypt': true,
      'iv': iv,
    };

    this.logger.verbose(requestData);
    this.logger.verbose(value);
    request.end(JSON.stringify(value));

    setTimeout(() => {
      request.abort();
    }, 400);
  }
}
