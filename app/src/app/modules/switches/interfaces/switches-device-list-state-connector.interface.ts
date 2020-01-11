import { Observable } from 'rxjs';
import { SwitchDeviceModel } from '../models/switch-device-model';
import { SwitchDeviceDto, SwitchDto } from './switch-device.interface';

export interface SwitchesDeviceListStateConnectorInterface {
  devices$: Observable<SwitchDeviceModel[]>;

  setDevices(devices: SwitchDeviceDto[]): void;

  openAddDeviceDialog(): void;

  openAddRoomDialog(): void;

  openAddScheduleDialog(deviceId): void;

  toggle(deviceId: string, switchStatus: SwitchDto): void;

  onOff(deviceId: string, state: boolean): void
}
