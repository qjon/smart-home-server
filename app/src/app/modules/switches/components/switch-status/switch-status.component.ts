import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SwitchDto, SwitchStatus} from '../../interfaces/switch-device.interface';
import {SwitchModel} from '../../models/switch-model';

@Component({
  selector: 'sh-switch-status',
  templateUrl: './switch-status.component.html',
  styleUrls: ['./switch-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchStatusComponent {
  @Input()
  public switchModel: SwitchModel;

  @Input()
  public deviceId: string;

  @Input()
  public isEnabled = false;

  @Output()
  public change = new EventEmitter<SwitchDto>();

  public toggle(value: boolean): void {
    this.change.emit({outlet: this.switchModel.outlet, switch: value ? SwitchStatus.ON : SwitchStatus.OFF});
  }
}
