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

  public get status(): SwitchDto[] {
    return this.data.params.switches;
  }

  public switches = new Map<number, SwitchModel>();

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

    this.status.forEach((s: SwitchNameDto) => {
      this.switches.set(s.outlet, new SwitchModel(s));
    });
  }

  public getSwitchesOutlet(): Iterable<number> {
    return this.switches.keys();
  }
}
