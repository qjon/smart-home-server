import { DeviceInterface } from './storage/device-interface';
import { LightParams } from './light/update-action.interface';

export interface LightDeviceInterface extends DeviceInterface {
  params: LightParams;
}
