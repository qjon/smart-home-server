import { Connection } from 'nodejs-websocket';

export interface DeviceConnection {
  deviceid: string;
  conn: Connection;
  sendMessages: Map<string, any>;
}

export interface DeviceStorageAdapterInterface {
  add(device: DeviceConnection): string;

  getOne(deviceId: string): DeviceConnection;

  getAll(): DeviceConnection[];
}
