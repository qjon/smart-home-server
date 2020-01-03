import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { NotificationsService } from '@core/notifications/notifications.service';

import {
  ScheduleActions,
  ScheduleCreateAction, ScheduleCreateErrorAction,
  ScheduleCreateSuccessAction, ScheduleOpenAddModalAction,
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
          map((schedule: ScheduleDto) => new ScheduleCreateSuccessAction({ schedule })),
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
      })
    );

  @Effect({ dispatch: false })
  public createErrorEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.CreateError),
      tap(() => {
        this.addDialogRef.close();
        this.notificationService.error('Create schedule', 'Schedule has not been created');
      })
    );

  private addDialogRef: MatDialogRef<AddScheduleModalComponent>;

  constructor(private actions$: Actions,
              private scheduleApiService: ScheduleApiService,
              private notificationService: NotificationsService,
              private matDialog: MatDialog) {
  }
}
