import { LightDefaultActionInterface } from './default-action.interface';

export enum LightSwitchStatus {
  ON = 'on',
  OFF = 'off',
}

export enum LightSwitchOutlet {
  ONE = 0,
  TWO = 1,
  THREE = 2,
  FOUR = 3,
}

export interface LightSwitch {
  switch: LightSwitchStatus;
  outlet: LightSwitchOutlet;
}

export interface LightSwitchConfigure {
  startup: LightSwitchStatus;
  outlet: LightSwitchOutlet;
}

export interface LightParams {
  switches: LightSwitch[];
  configure: LightSwitchConfigure[];
  fwVersion: string;
  rssi: number;
  staMac: string;
}

export interface LightUpdateActionInterface extends LightDefaultActionInterface {
  params: LightParams;
}
