import {Injectable} from '@angular/core';
import {SwitchesStateConnectorsModule} from './switches-state-connectors.module';
import {select, Store} from '@ngrx/store';
import {Observable, ReplaySubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {switchesSelectors} from '../switches-selectors';
import {SwitchDeviceModel} from '../../models/switch-device-model';
import {SwitchDeviceChangeSettingsDto} from '../../interfaces/switch-device.interface';
import {SwitchesChangeSettingsAction} from '../switches-actions';

@Injectable({
  providedIn: SwitchesStateConnectorsModule
})
export class DeviceDetailsStateConnectorService {
  private currentDeviceId = new ReplaySubject<string>(1);

  public device$: Observable<SwitchDeviceModel> = this.currentDeviceId.asObservable()
    .pipe(
      switchMap((id: string) => this.store
        .pipe(
          select(switchesSelectors.deviceSelector, {deviceId: id}),
        )
      )
    );

  constructor(private store: Store<any>) {
  }

  public setCurrentDeviceId(id: string): void {
    this.currentDeviceId.next(id);
  }

  public update(deviceId: string, data: SwitchDeviceChangeSettingsDto) {
    this.store.dispatch(new SwitchesChangeSettingsAction({deviceId, data}));
  }
}
