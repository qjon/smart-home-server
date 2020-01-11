import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {Store} from '@ngrx/store';
import {Actions} from '@ngrx/effects';

import {AbstractFormDialogComponent} from '@core/classes/abstract-form-dialog.component';

import {SwitchActionTypes, SwitchesCreateAction} from '../../store/switches-actions';

@Component({
  selector: 'sh-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent extends AbstractFormDialogComponent<AddDeviceComponent> implements OnInit {

  public form: FormGroup;

  constructor(protected fb: FormBuilder,
              protected matDialogRef: MatDialogRef<AddDeviceComponent>,
              protected actions$: Actions,
              private store: Store<any>) {
    super();
  }


  public onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(new SwitchesCreateAction(this.form.value));
    }
  }

  protected createForm(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      deviceId: [null, Validators.required],
      apiKey: [null, Validators.required],
    });
  }

  protected listOfActions(): string[] {
    return [SwitchActionTypes.CreateError, SwitchActionTypes.CreateSuccess];
  }
}
