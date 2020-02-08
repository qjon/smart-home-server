import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { AbstractFormDialogComponent } from '@rign/sh-core';
import { ScheduleActions, ScheduleCreateAction } from '../../store/schedule-actions';

@Component({
  selector: 'sh-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss'],
})
export class AddScheduleModalComponent extends AbstractFormDialogComponent<AddScheduleModalComponent> implements OnInit {
  constructor(protected fb: FormBuilder,
              protected matDialogRef: MatDialogRef<AddScheduleModalComponent>,
              protected actions$: Actions,
              private store: Store<any>,
              @Inject(MAT_DIALOG_DATA) public data: { deviceId: string }) {
    super();
  }

  public createForm(): FormGroup {
    return this.fb.group({
      action: [true, Validators.required],
      day: [null, Validators.required],
      time: [null, Validators.required],
    });
  }

  public onSubmit(): void {
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      this.isSaving = true;
      this.store.dispatch(new ScheduleCreateAction({
        scheduleData: {
          ...this.form.value,
          deviceId: this.data.deviceId,
        },
      }));
    }
  }

  protected listOfActions(): string[] {
    return [ScheduleActions.CreateSuccess, ScheduleActions.CreateError];
  }
}
