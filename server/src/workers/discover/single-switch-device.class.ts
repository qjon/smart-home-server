import { DeviceSwitchesInterface } from './interfaces';
import { LightSwitch, LightSwitchConfigure, LightSwitchStatus } from '../../interfaces/light/update-action.interface';

export class SingleSwitchDevice implements DeviceSwitchesInterface {
  readonly type = 'single';

  public constructor(private data: { switch: LightSwitchStatus, startup: LightSwitchStatus }) {
  }

  public getConfiguration(): LightSwitchConfigure[] {
    return [{ startup: this.data.startup, outlet: 0 }];
  }

  public getSwitches(): LightSwitch[] {
    return [{ switch: this.data.switch, outlet: 0 }];
  }
}