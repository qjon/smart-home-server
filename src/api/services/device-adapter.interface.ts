import { LightSwitch, LightSwitchStatus } from '../../interfaces/light/update-action.interface';

export interface BaseRequestDataInterface {
  host: string;
  port: number;
  path: string;
  method: 'POST';
  deviceId: string;
  apiKey: string;
}

export interface UpdateSwitchStateDataInterface extends BaseRequestDataInterface {
  data: { switches: LightSwitch[] } | { switch: LightSwitchStatus };
}

export interface DeviceAdapterInterface {
  updateSwitches(data: UpdateSwitchStateDataInterface): void;
}
