import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SwitchStatus} from '../../interfaces/switch-device.interface';

@Component({
  selector: 'sh-device-on-off',
  templateUrl: './device-on-off.component.html',
  styleUrls: ['./device-on-off.component.scss']
})
export class DeviceOnOffComponent {
  @Output()
  public toggle = new EventEmitter<boolean>();

  @Input()
  public isEnabled = false;

  @Input()
  public value: SwitchStatus = SwitchStatus.OFF;

  @Input()
  public set size(size: string) {
    this._buttonSize = {
      width: size,
      height: size,
      'line-height': size,
    };
    this._iconSize = {
      'font-size': size,
      'line-height': '1em',
      width: '1em',
      height: '1em',
    };
  }

  public _buttonSize: { [key: string]: string } = {};
  public _iconSize: { [key: string]: string } = {};

  public toggleClick($event: MouseEvent): void {
    this.toggle.emit(this.value === SwitchStatus.OFF);
  }
}
