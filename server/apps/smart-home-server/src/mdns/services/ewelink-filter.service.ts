import { Injectable } from '@nestjs/common';
import { DiscoveredDeviceFilterInterface } from '../interfaces/discovered-device-filter.interface';
import {
  AnswerType,
  DiscoveredDeviceAnswerTxt,
  DiscoveredDevicePacketInterface,
} from '../../workers/discover/interfaces';

export const EWELINK_SERVICE_NAME = '_ewelink._tcp.local';

@Injectable()
export class EwelinkFilterService implements DiscoveredDeviceFilterInterface {
  public filter(packet: DiscoveredDevicePacketInterface): boolean {
    const ptrRecord = packet.answers.find((item) => item.type === AnswerType.PTR);

    return ptrRecord && ptrRecord.name === EWELINK_SERVICE_NAME;
  }

  public getId(packet: DiscoveredDevicePacketInterface): string {
    const txtRecord = packet.answers.find((item) => item.type === AnswerType.TXT) as DiscoveredDeviceAnswerTxt;

    return txtRecord ? txtRecord.rdata.id : null;
  }
}
