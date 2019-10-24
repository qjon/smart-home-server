import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  SwitchActionTypes,
  SwitchesChangeStatusAction,
  SwitchesChangeStatusErrorAction,
  SwitchesChangeStatusSuccessAction,
  SwitchesCreateAction,
  SwitchesCreateErrorAction,
  SwitchesCreateSuccessAction,
  SwitchesOnOffAction,
  SwitchesOnOffSuccessAction
} from '../switches-actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SwitchesApiService} from '../../api/switches-api.service';
import {of} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddDeviceComponent} from '../../components/add-device/add-device.component';
import {NotificationsService} from '../../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SwitchesEffectsService {

  @Effect({dispatch: true})
  public changeStatus = this.actions$
    .pipe(
      ofType(SwitchActionTypes.ChangeStatus),
      switchMap((action: SwitchesChangeStatusAction) => {
        return this.switchesApiService.changeStatus(action.payload.deviceId, action.payload.switch)
          .pipe(
            map(() => {
              const deviceId = action.payload.deviceId;
              const switchStatus = action.payload.switch;

              return new SwitchesChangeStatusSuccessAction({deviceId, switch: switchStatus});
            }),
            catchError(() => of(new SwitchesChangeStatusErrorAction()))
          );
      })
    );

  @Effect({dispatch: true})
  public onOff = this.actions$
    .pipe(
      ofType(SwitchActionTypes.OnOff),
      switchMap((action: SwitchesOnOffAction) => {
        const {deviceId, status} = action.payload;

        return this.switchesApiService.toggleAll(deviceId, status)
          .pipe(
            map(() => new SwitchesOnOffSuccessAction({deviceId, status}))
          );
      })
    );

  @Effect({dispatch: false})
  public openCreateDialogEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.OpenCreateDialog),
      switchMap(() => {
          this.addDialogRef = this.matDialog.open(AddDeviceComponent, {
            width: '400px',
            panelClass: 'add-device',
            disableClose: true,
          });

          return this.addDialogRef.afterClosed();
        }
      )
    );

  @Effect({dispatch: true})
  public createEffect$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.Create),
      switchMap((action: SwitchesCreateAction) => this.switchesApiService.create(
        action.payload.deviceId,
        action.payload.apiKey,
        action.payload.name,
      )),
      map(() => new SwitchesCreateSuccessAction()),
      catchError((e) => of(new SwitchesCreateErrorAction({error: e})))
    );

  @Effect({dispatch: false})
  public createEffectSuccess$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.CreateSuccess),
      tap(() => {
        this.addDialogRef.close();
        this.notificationService.success('Create Device', 'Device has been created');
      }),
    );

  @Effect({dispatch: false})
  public createEffectError$ = this.actions$
    .pipe(
      ofType(SwitchActionTypes.CreateError),
      tap(() => {
        this.notificationService.success('Create Device', 'Device has not been created');
      }),
    );


  private addDialogRef: MatDialogRef<AddDeviceComponent>;

  constructor(protected actions$: Actions,
              protected switchesApiService: SwitchesApiService,
              private matDialog: MatDialog,
              private notificationService: NotificationsService) {
  }
}
