import {Injectable} from '@angular/core';
import {SwitchesStateConnectorInterface} from '../../interfaces/switches-state-connector.interface';
import {select, Store} from '@ngrx/store';
import {switchesSelectors} from '../switches-selectors';
import {SwitchDeviceDto, SwitchDto, SwitchStatus} from '../../interfaces/switch-device.interface';
import {SwitchesChangeStatusAction, SwitchesLoadAction, SwitchesOnOffAction, SwitchesOpenCreateDialogAction} from '../switches-actions';
import {SwitchesStateConnectorsModule} from './switches-state-connectors.module';
import {RoomsOpenCreateDialogAction} from '../../../rooms/store/rooms-actions';

@Injectable({
  providedIn: SwitchesStateConnectorsModule
})
export class SwitchesStateConnectorService implements SwitchesStateConnectorInterface {

  public devices$ = this.store
    .pipe(
      select(switchesSelectors.switchesDeviceListSelector),
    );

  constructor(protected store: Store<any>) {
  }

  public setDevices(devices: SwitchDeviceDto[]): void {
    this.store.dispatch(new SwitchesLoadAction({devices}));
  }

  public openAddDeviceDialog(): void {
    this.store.dispatch(new SwitchesOpenCreateDialogAction());
  }

  public openAddRoomDialog(): void {
    this.store.dispatch(new RoomsOpenCreateDialogAction());
  }

  public toggle(deviceId: string, switchStatus: SwitchDto) {
    this.store.dispatch(new SwitchesChangeStatusAction({deviceId, switch: switchStatus}));
  }

  public onOff(deviceId: string, state: boolean): void {
    const status = state ? SwitchStatus.ON : SwitchStatus.OFF;

    this.store.dispatch(new SwitchesOnOffAction({deviceId, status}));
  }

}
