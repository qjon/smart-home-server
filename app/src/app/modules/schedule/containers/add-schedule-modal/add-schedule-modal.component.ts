import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sh-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss'],
})
export class AddScheduleModalComponent implements OnInit {

  public formGroup: FormGroup;
  public isSaving: boolean = false;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddScheduleModalComponent>) { }

  public ngOnInit(): void {
    this.formGroup = this.fb.group({
      action: [false, Validators.required],
      day: [1, Validators.required],
      time: [null, Validators.required],
    });
  }

  public onSubmit(): void {

  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
