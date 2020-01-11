import {OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Actions, ofType} from '@ngrx/effects';
import {takeUntil} from 'rxjs/operators';
import { Destroyable } from '@core/classes/destroyable.component';

export abstract class AbstractFormDialogComponent<T> extends Destroyable implements OnInit {
  public form: FormGroup;

  public isSaving = false;

  protected abstract fb: FormBuilder;

  protected abstract matDialogRef: MatDialogRef<T>;

  protected abstract actions$: Actions;

  public ngOnInit(): void {
    this.form = this.createForm();

    this.actions$
      .pipe(
        ofType.apply(this, this.listOfActions()),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.isSaving = false;
      });
  }

  public onCancel(): void {
    this.isSaving = false;
    this.matDialogRef.close();
  }

  public abstract onSubmit(): void;

  protected abstract createForm(): FormGroup;

  protected abstract listOfActions(): string[];
}
