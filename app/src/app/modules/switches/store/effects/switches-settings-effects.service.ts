import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {of} from 'rxjs';
import { catchError, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import {NotificationsService} from '@core/notifications/notifications.service';

import {
  SwitchActionTypes,
  SwitchesChangeSettingsAction,
  SwitchesChangeSettingsErrorAction,
  SwitchesChangeSettingsSuccessAction
} from '../switches-actions';
import {SwitchesApiService} from '../../api/switches-api.service';
import { MoveDeviceToRoomAction } from '../../../rooms/store/rooms-actions';
import { switchesSelectors } from '../switches-selectors';
import { SwitchDeviceModel } from '../../models/switch-device-model';

@Injectable()
export class SwitchesSettingsEffectsService {
  @Effect({dispatch: true})
  public changeSettingsEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.ChangeSettings),
      switchMap((action: SwitchesChangeSettingsAction) => this.switchesApiService.update(action.payload.deviceId, action.payload.data)
        .pipe(
          switchMap(() => this.store
            .pipe(
              select(switchesSelectors.deviceSelector, { deviceId: action.payload.deviceId }),
              take(1),
              mergeMap((device: SwitchDeviceModel) => {
                return [
                  new SwitchesChangeSettingsSuccessAction(action.payload),
                  new MoveDeviceToRoomAction({deviceId: action.payload.deviceId, roomId: action.payload.data.room ? action.payload.data.room.id : null, prevRoomId: device.roomId}),
                ];
              }),
            )
          ),
          catchError((e) => of(new SwitchesChangeSettingsErrorAction(e)))
        )
      )
    );

  @Effect({dispatch: false})
  public changeSwitchErrorEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.ChangeSettingsError),
      tap(() => this.notificationService.error('Update', 'Device has not been changed'))
    );

  @Effect({dispatch: false})
  public changeSwitchSuccessEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.ChangeSettingsSuccess),
      tap(() => this.notificationService.success('Update', 'Device has been changed'))
    );

  constructor(protected actions$: Actions,
              protected store: Store<any>,
              protected switchesApiService: SwitchesApiService,
              protected notificationService: NotificationsService) {
  }
}
