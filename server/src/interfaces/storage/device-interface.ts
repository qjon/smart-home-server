import Connection from 'nodejs-websocket';

export interface DeviceInterface {
  deviceid: string;
  connection: Connection;
  name?: string;
  apikey: string;
  model: string;
  isAlive: boolean;
  isConnected: boolean;
  sendMessages: Map<string, any>;
  params?: any;
}
