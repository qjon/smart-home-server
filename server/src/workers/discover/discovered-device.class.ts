import { SonOffEncryptionService } from '../sonoff-encryption.service';
import {
  AnswerType,
  DeviceSwitchesInterface,
  DiscoveredDeviceAnswerA,
  DiscoveredDeviceAnswerSrv,
  DiscoveredDeviceAnswerTxt,
  DiscoveredDeviceInterface,
} from './interfaces';
import { SingleSwitchDevice } from './single-switch-device.class';
import { MultipleSwitchDevice } from './multiple-switch-device.class';

export class DiscoveredDevice {
  readonly isNew: boolean;
  readonly apiKey: string;
  readonly data: DeviceSwitchesInterface;

  readonly host: string;
  readonly port: number;

  get id(): string {
    return this.txtRecord.rdata.id;
  }

  get iv(): string {
    return this.txtRecord.rdata.iv;
  }

  get encryptedData(): string {
    let data = this.txtRecord.rdata.data1;

    if (this.txtRecord.rdata.data2) {
      data += this.txtRecord.rdata.data2;
    }

    if (this.txtRecord.rdata.data3) {
      data += this.txtRecord.rdata.data3;
    }

    return data;
  }

  private txtRecord: DiscoveredDeviceAnswerTxt;

  constructor(data: DiscoveredDeviceInterface, keys: Map<string, string>) {
    this.txtRecord = data.packet.answers.find((answer) => answer.type === AnswerType.TXT) as DiscoveredDeviceAnswerTxt;
    const srvRecord = data.packet.answers.find((answer) => answer.type === AnswerType.SRV) as DiscoveredDeviceAnswerSrv;
    const aRecord = data.packet.answers.find((answer) => answer.type === AnswerType.A) as DiscoveredDeviceAnswerA;

    this.isNew = !keys.has(this.id);
    this.apiKey = this.isNew ? null : keys.get(this.id);

    this.data = this.isNew ? null : this.getData();

    this.host = aRecord.rdata;
    this.port = srvRecord.rdata.port;
  }

  private getData(): DeviceSwitchesInterface {
    const encryptionService = new SonOffEncryptionService();

    const data = JSON.parse(encryptionService.decrypt(this.encryptedData, this.iv, this.apiKey));

    if (data['switch']) {
      return new SingleSwitchDevice(data);
    } else if (data['switches']) {
      return new MultipleSwitchDevice(data);
    } else {
      return null;
    }
  }
}