import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { NotificationsService } from '@core/notifications/notifications.service';

import {
  ScheduleActions,
  ScheduleChangeActiveStatusAction,
  ScheduleChangeActiveStatusErrorAction,
  ScheduleChangeActiveStatusSuccessAction,
  ScheduleCreateAction,
  ScheduleCreateErrorAction,
  ScheduleCreateSuccessAction, ScheduleLoadAction, ScheduleLoadErrorAction, ScheduleLoadSuccessAction,
  ScheduleOpenAddModalAction, ScheduleRemoveAction, ScheduleRemoveErrorAction, ScheduleRemoveSuccessAction,
} from '../schedule-actions';
import { ScheduleApiService } from '../../api/schedule-api.service';
import { ScheduleDto } from '../../interfaces/schedule-dto.interface';
import { AddScheduleModalComponent } from '../../containers/add-schedule-modal/add-schedule-modal.component';

@Injectable()
export class ScheduleEffectService {

  @Effect({
    dispatch: false,
  })
  public openCreateScheduleEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.OpenAddModal),
      switchMap((action: ScheduleOpenAddModalAction) => {
        this.addDialogRef = this.matDialog.open<AddScheduleModalComponent>(AddScheduleModalComponent, {
          width: '400px',
          panelClass: 'add-schedule',
          disableClose: true,
          data: {
            deviceId: action.payload.deviceId,
          },
        });

        return this.addDialogRef.afterClosed();
      }),
    );

  @Effect({ dispatch: true })
  public createEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.Create),
      switchMap((action: ScheduleCreateAction) => this.scheduleApiService.create(action.payload.scheduleData)
        .pipe(
          map((schedule: ScheduleDto) => new ScheduleCreateSuccessAction({ deviceId: action.payload.scheduleData.deviceId, schedule })),
          catchError((error: any) => of(new ScheduleCreateErrorAction({ error }))),
        ),
      ),
    );


  @Effect({ dispatch: false })
  public createSuccessEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.CreateSuccess),
      tap(() => {
        this.addDialogRef.close();
        this.notificationService.success('Create schedule', 'Schedule has been created');
      }),
    );

  @Effect({ dispatch: false })
  public createErrorEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.CreateError),
      tap(() => {
        this.addDialogRef.close();
        this.notificationService.error('Create schedule', 'Schedule has not been created');
      }),
    );

  @Effect({ dispatch: true })
  public changeActiveStatusEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.ChangeActiveStatus),
      switchMap((action: ScheduleChangeActiveStatusAction) => this.scheduleApiService.toggleActivate(action.payload.deviceId, action.payload.scheduleId, action.payload.isActive)
        .pipe(
          map((response: ScheduleDto) => new ScheduleChangeActiveStatusSuccessAction({
            deviceId: action.payload.deviceId,
            scheduleId: action.payload.scheduleId,
            isActive: action.payload.isActive,
          })),
          catchError((error: any) => of(new ScheduleChangeActiveStatusErrorAction({
            deviceId: action.payload.deviceId,
            scheduleId: action.payload.scheduleId,
            error,
          }))),
        ),
      ),
    );

  @Effect({ dispatch: true })
  public removeEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.Remove),
      switchMap((action: ScheduleRemoveAction) => this.scheduleApiService.remove(action.payload.deviceId, action.payload.scheduleId)
        .pipe(
          map((response: boolean) => new ScheduleRemoveSuccessAction({
            deviceId: action.payload.deviceId,
            scheduleId: action.payload.scheduleId,
          })),
          catchError((error: any) => of(new ScheduleRemoveErrorAction({
            deviceId: action.payload.deviceId,
            scheduleId: action.payload.scheduleId,
            error,
          }))),
        ),
      ),
    );

  @Effect({ dispatch: true })
  public loadEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.Load),
      switchMap((action: ScheduleLoadAction) => this.scheduleApiService.get(action.payload.deviceId)
        .pipe(
          map((scheduleList: ScheduleDto[]) => new ScheduleLoadSuccessAction({
            deviceId: action.payload.deviceId,
            scheduleList,
          })),
          catchError((error: any) => of(new ScheduleLoadErrorAction({
            deviceId: action.payload.deviceId,
            error,
          }))),
        ),
      ),
    );

  private addDialogRef: MatDialogRef<AddScheduleModalComponent>;

  constructor(private actions$: Actions,
              private scheduleApiService: ScheduleApiService,
              private notificationService: NotificationsService,
              private matDialog: MatDialog) {
  }
}
