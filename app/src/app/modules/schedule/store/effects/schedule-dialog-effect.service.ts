import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';

import { AddScheduleModalComponent } from '../../containers/add-schedule-modal/add-schedule-modal.component';
import { ScheduleActions } from '../schedule-actions';

@Injectable()
export class ScheduleDialogEffectService {

  @Effect({ dispatch: false })
  public openCreateRoomEffect$ = this.actions$
    .pipe(
      ofType(ScheduleActions.OpenAddModal),
      switchMap(() => {
        console.log('abc')
        this.addDialogRef = this.matDialog.open<AddScheduleModalComponent>(AddScheduleModalComponent, {
          width: '400px',
          panelClass: 'add-schedule',
          disableClose: true,
        });

        return this.addDialogRef.afterClosed();
      }),
    );

  private addDialogRef: MatDialogRef<AddScheduleModalComponent>;

  constructor(private actions$: Actions,
              private matDialog: MatDialog) {

    console.log('scheduler')
  }
}
