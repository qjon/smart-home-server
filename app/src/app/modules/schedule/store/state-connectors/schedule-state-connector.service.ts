import { Injectable } from '@angular/core';
import { ScheduleStateConnectorsModule } from './schedule-state-connectors.module';
import { select, Store } from '@ngrx/store';
import { ScheduleStateConnectorInterface } from '../../interfaces/schedule-state-connector.interface';
import { Observable } from 'rxjs';
import { ScheduleDto } from '../../interfaces/schedule-dto.interface';
import { scheduleSelectors } from '../schedule-selectors';
import { ScheduleLoadAction } from '../schedule-actions';

@Injectable({
  providedIn: ScheduleStateConnectorsModule
})
export class ScheduleStateConnectorService implements ScheduleStateConnectorInterface {

  constructor(private store: Store<any>) {

  }

  public getList(deviceId: string): Observable<ScheduleDto[]> {
    return  this.store
      .pipe(
        select(scheduleSelectors.scheduleListSelector, {deviceId: deviceId})
      );
  }

  public load(deviceId): void {
    this.store.dispatch(new ScheduleLoadAction({deviceId}));
  }
}
