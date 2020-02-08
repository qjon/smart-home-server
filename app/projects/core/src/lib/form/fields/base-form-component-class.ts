import { FormControl, FormGroupDirective, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DoCheck, ElementRef, HostBinding, Input, OnDestroy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Subject } from 'rxjs';

export class BaseFormComponentClass implements OnDestroy, DoCheck {
  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  public stateChanges = new Subject<void>();

  public destroy$ = new Subject<void>();

  public focused = false;

  public ngControl: NgControl;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  public get errorState(): boolean {
    return this.errorStateMatcher.isErrorState(this.ngControl.control as FormControl, this.formGroupDirective);
  }

  protected fm: FocusMonitor;

  protected elRef: ElementRef<HTMLElement>;

  protected _disabled = false;

  protected _placeholder: string;

  protected _required = false;

  protected _value: any;

  protected onChange: (value: any) => void;

  protected onTouched: (value: any) => void;

  protected formGroupDirective: FormGroupDirective;

  protected errorStateMatcher: ErrorStateMatcher;

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      // update error state, which is responsible for displaying errors
      // this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }


  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  protected monitorFocus(): void {
    this.fm.monitor(this.elRef.nativeElement, true)
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }
}
