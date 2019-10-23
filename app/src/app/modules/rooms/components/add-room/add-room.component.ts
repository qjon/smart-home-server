import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {RoomsStateConnectorService} from '../../store/state-connectors/rooms-state-connector.service';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';
import {AbstractFormDialogComponent} from '../../../../core/classes/abstract-form-dialog.component';
import {Actions} from '@ngrx/effects';
import {RoomsActionTypes} from '../../store/rooms-actions';

@Component({
  selector: 'sh-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent extends AbstractFormDialogComponent<AddRoomComponent> implements OnInit {
  public form: FormGroup;

  constructor(protected fb: FormBuilder,
              protected matDialogRef: MatDialogRef<AddRoomComponent>,
              protected actions$: Actions,
              @Inject(RoomsStateConnectorService) private roomsStateConnector: RoomsStateConnectorInterface) {
    super();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.roomsStateConnector.createRoom(this.form.controls['name'].value);
    }
  }

  protected createForm(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required]
    });
  }

  protected listOfActions(): string[] {
    return [RoomsActionTypes.CreateError, RoomsActionTypes.CreateSuccess];
  }
}
