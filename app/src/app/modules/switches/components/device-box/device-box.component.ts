import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {SwitchDeviceModel} from '../../models/switch-device-model';
import {SwitchesStateConnectorService} from '../../store/state-connectors/switches-state-connector.service';
import {SwitchesStateConnectorInterface} from '../../interfaces/switches-state-connector.interface';

@Component({
  selector: 'sh-device-box',
  templateUrl: './device-box.component.html',
  styleUrls: ['./device-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceBoxComponent {

  @Input()
  public set device(device: SwitchDeviceModel) {
    this._device = device;
  }

  public get device(): SwitchDeviceModel {
    return this._device;
  }

  public get switchesKeys(): IterableIterator<number> {
    return this._device ? this._device.switches.keys() : null;
  }

  private _device: SwitchDeviceModel;


  constructor(@Inject(SwitchesStateConnectorService) public switchesStateConnectorService: SwitchesStateConnectorInterface) {
  }

  public addSchedule(): void {

  }

  public trackByOutlet(value: number): string {
    return value.toString();
  }
}
