import { SonOffEncryptionService } from '../sonoff-encryption.service';
import {
  AnswerType,
  DeviceSwitchesInterface,
  DiscoveredDeviceAnswerTxt,
  DiscoveredDeviceInterface,
} from './interfaces';
import { SingleSwitchDevice } from './single-switch-device.class';
import { MultipleSwitchDevice } from './multiple-switch-device.class';

export class DiscoveredDevice {
  readonly isNew: boolean;
  readonly apiKey: string;
  readonly data: DeviceSwitchesInterface;

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
    this.txtRecord = data.packet.answers
      .filter((answer) => answer.type === AnswerType.TXT)
      .map((answer) => answer as DiscoveredDeviceAnswerTxt)
      .pop();

    this.isNew = !keys.has(this.id);
    this.apiKey = this.isNew ? null : keys.get(this.id);

    this.data = this.isNew ? null : this.getData();
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