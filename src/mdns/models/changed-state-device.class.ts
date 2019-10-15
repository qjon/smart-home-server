import { ChangedStateDeviceInterface } from '../interfaces/changed-state-device.interface';
import { ChangedStateDiscoveredDeviceInterface } from '../interfaces/changed-state-discovered-device.interface';
import { AnswerType, DeviceSwitchesInterface, DiscoveredDeviceAnswerTxt } from '../../workers/discover/interfaces';
import { SonOffEncryptionService } from '../../workers/sonoff-encryption.service';
import { SingleSwitchDevice } from '../../workers/discover/single-switch-device.class';
import { MultipleSwitchDevice } from '../../workers/discover/multiple-switch-device.class';
import { Logger } from '@nestjs/common';

export class ChangedStateDeviceClass implements ChangedStateDeviceInterface {
  readonly encryptedData: string;
  readonly id: string;
  readonly seq: string;

  private txtRecord: DiscoveredDeviceAnswerTxt;

  private logger = new Logger(this.constructor.name);

  constructor(device: ChangedStateDiscoveredDeviceInterface) {

    try {
      const txtRecord = this.getTxtRecord(device);

      this.id = txtRecord.rdata.id;
      this.seq = txtRecord.rdata.seq;
      this.encryptedData = this.getEncryptedData(txtRecord);
      this.txtRecord = txtRecord;
    } catch (e) {
      this.logger.error('Can not get TXT Record');
      this.logger.error(device);
    }
  }

  /**
   * Decrypt and return data, needs ApiKey to decrypt data
   */
  public getData(apiKey: string): DeviceSwitchesInterface {
    const encryptionService = new SonOffEncryptionService();

    const data = JSON.parse(encryptionService.decrypt(this.encryptedData, this.txtRecord.rdata.iv, apiKey));

    if (data.switch) {
      return new SingleSwitchDevice(data);
    } else if (data.switches) {
      return new MultipleSwitchDevice(data);
    } else {
      return null;
    }
  }

  private getTxtRecord(device: ChangedStateDiscoveredDeviceInterface): DiscoveredDeviceAnswerTxt {
    return device.answers.find((a) => a.type === AnswerType.TXT) as DiscoveredDeviceAnswerTxt;
  }

  private getEncryptedData(txtRecord: DiscoveredDeviceAnswerTxt): string {
    let data = txtRecord.rdata.data1;

    if (txtRecord.rdata.data2) {
      data += txtRecord.rdata.data2;
    }

    if (txtRecord.rdata.data3) {
      data += txtRecord.rdata.data3;
    }

    if (txtRecord.rdata.data4) {
      data += txtRecord.rdata.data4;
    }

    return data;
  }
}
