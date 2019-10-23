import {SwitchNameDto, SwitchStatus} from '../interfaces/switch-device.interface';

export class SwitchModel {
  public get outlet(): number {
    return this.data.outlet;
  }

  public get status(): SwitchStatus {
    return this.data.switch === SwitchStatus.ON ? SwitchStatus.ON : SwitchStatus.OFF;
  }

  public get name(): string {
    return this.data.name;
  }

  constructor(protected data: SwitchNameDto) {

  }
}
