import { LightSwitch, LightSwitchConfigure } from '../../interfaces/light/update-action.interface';

export interface DiscoveredDeviceAnswer {
  name: string;
  type: string;
  class: string;
  flash: boolean;
  ttl: number;
}

export enum AnswerType {
  PTR = 'PTR',
  TXT = 'TXT',
}

export interface DiscoveredDeviceAnswerPtr extends DiscoveredDeviceAnswer {
  type: AnswerType.PTR;
}

export interface DiscoveredDeviceAnswerTxt extends DiscoveredDeviceAnswer {
  type: AnswerType.TXT;
  rdata: {
    id: string;
    type: string;
    encrypt: boolean;
    iv: string;
    seq: string;
    data1?: string;
    data2?: string;
    data3?: string;
    data4?: string;
  };
}

export type Answers =
  DiscoveredDeviceAnswerPtr
  | DiscoveredDeviceAnswerTxt
  ;

export interface DiscoveredDevicePacketInterface {
  answers: Answers[];
}

export interface DiscoveredDeviceInterface {
  address: string;
  service: {
    port: number;
    protocol: string;
    type: string;
  };
  packet: DiscoveredDevicePacketInterface;
}

export type SwitchTypeModel = 'single' | 'multi';

export interface DeviceSwitchesInterface {
  readonly type: SwitchTypeModel;

  getSwitches(): LightSwitch[];

  getConfiguration(): LightSwitchConfigure[];
}