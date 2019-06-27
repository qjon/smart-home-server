import { LightDefaultActionInterface } from './default-action.interface';

export interface LightRegisterActionInterface extends LightDefaultActionInterface {
  version: number;
  romVersion: string;
  model: string;
  ts: number; // interval in seconds
}
