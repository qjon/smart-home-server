import { LightDefaultActionInterface } from './default-action.interface';
import { LightRegisterActionInterface } from './register-action.interface';
import { LightUpdateActionInterface } from './update-action.interface';

export type DeviceAction =
  LightDefaultActionInterface
  | LightRegisterActionInterface
  | LightUpdateActionInterface
  ;
