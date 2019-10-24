import { DeviceSwitchesInterface } from './interfaces';
import { LightSwitch, LightSwitchConfigure } from '../../interfaces/light/update-action.interface';

export class MultipleSwitchDevice implements DeviceSwitchesInterface {
  readonly type = 'multi';

  public constructor(private data: { configure: LightSwitchConfigure[], switches: LightSwitch[] }) {
  }

  public getConfiguration(): LightSwitchConfigure[] {
    return this.data.configure;
  }

  public getSwitches(): LightSwitch[] {
    return this.data.switches;
  }

}