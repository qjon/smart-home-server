import { DeviceSwitchesInterface } from '../../workers/discover/interfaces';

export interface ChangedStateDeviceInterface {
  readonly id: string;
  readonly seq: string;
  readonly encryptedData: string;

  getData(apiKey: string): DeviceSwitchesInterface;
}
