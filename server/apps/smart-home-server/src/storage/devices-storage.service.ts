import { Injectable } from '@nestjs/common';
import {
  DeviceConnection,
  DeviceStorageAdapterInterface,
} from '../interfaces/storage/device-storage-adapter.interface';

@Injectable()
export class DevicesStorageService implements DeviceStorageAdapterInterface {
  protected devices = new Map<string, DeviceConnection>();

  add(device: DeviceConnection): string {
    const deviceid = device.deviceid;

    this.devices.set(deviceid, device);

    return deviceid;
  }

  getAll(): DeviceConnection[] {
    return Array.from(this.devices).map(d => d[1]);
  }

  getOne(deviceId: string): DeviceConnection {
    return this.devices.get(deviceId) || null;
  }

  protected getDevice(deviceId: string): DeviceConnection {
    const device = this.devices.get(deviceId);

    return device ? device : null;
  }
}
