import {OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Actions, ofType} from '@ngrx/effects';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class AbstractFormDialogComponent<T> implements OnInit, OnDestroy {
  public form: FormGroup;

  public isSaving = false;

  protected abstract fb: FormBuilder;

  protected abstract matDialogRef: MatDialogRef<T>;

  protected abstract actions$: Actions;

  protected destroy$ = new ReplaySubject<void>(1);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
