import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  SwitchActionTypes,
  SwitchesChangeSettingsAction,
  SwitchesChangeSettingsErrorAction,
  SwitchesChangeSettingsSuccessAction
} from '../switches-actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SwitchesApiService} from '../../api/switches-api.service';
import {of} from 'rxjs';
import {NotificationsService} from '../../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SwitchesSettingsEffectsService {
  @Effect({dispatch: true})
  public changeSettingsEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.ChangeSettings),
      switchMap((action: SwitchesChangeSettingsAction) => this.switchesApiService.update(action.payload.deviceId, action.payload.data)
        .pipe(
          map(() => new SwitchesChangeSettingsSuccessAction(action.payload)),
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
              protected switchesApiService: SwitchesApiService,
              protected notificationService: NotificationsService) {
  }
}
