import {SwitchDeviceDto, SwitchDto, SwitchNameDto} from '../interfaces/switch-device.interface';
import {SwitchModel} from './switch-model';

export class SwitchDeviceModel {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly apiKey: string;
  readonly isSingleSwitch: boolean;
  readonly isConnected: boolean;
  readonly lastStatusChangeTimestamp: Date;
  readonly isAssignedToRoom: boolean;
  readonly roomId: number;
  readonly roomName: string;

  /**
   * @deprecated Use switches instead of status
   */
  public get status(): SwitchNameDto[] {
    return this.data.params.switches;
  }

  public get switches(): SwitchNameDto[] {
    return this.data.params.switches;
  }

  constructor(protected data: SwitchDeviceDto) {
    this.id = this.data.deviceid;
    this.name = this.data.name;
    this.model = this.data.model;
    this.apiKey = this.data.apiKey;
    this.isSingleSwitch = this.data.isSingleSwitch;
    this.isConnected = this.data.isConnected;
    this.lastStatusChangeTimestamp = this.data.lastStatusChangeTimestamp ? new Date(this.data.lastStatusChangeTimestamp) : null;
    this.roomId = this.data.room ? this.data.room.id : null;
    this.roomName = this.data.room ? this.data.room.name : '';
    this.isAssignedToRoom = !!this.data.room;
  }

  public getSwitchesOutlet(): Iterable<number> {
    return this.status.map((s: SwitchDto) => s.outlet);
  }

  public getOutlet(outlet: number): SwitchModel {
    const switchOutlet = this.status.find((s: SwitchNameDto) => s.outlet === outlet);
    if (switchOutlet) {
      return new SwitchModel(switchOutlet);
    } else {
      return null;
    }
  }
}
