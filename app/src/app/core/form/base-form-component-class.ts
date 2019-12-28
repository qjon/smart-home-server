import { Subject } from 'rxjs';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DoCheck, ElementRef, HostBinding, OnDestroy } from '@angular/core';

export class BaseFormComponentClass implements OnDestroy, DoCheck {
  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  public stateChanges = new Subject<void>();

  public focused = false;

  public errorState = false;

  public ngControl: NgControl;

  protected fm: FocusMonitor;

  protected elRef: ElementRef<HTMLElement>;

  protected _disabled = false;

  protected _placeholder: string;

  protected _required = false;

  protected _value: boolean[] = [];

  protected onChange: (value: any) => void;

  protected onTouched: (value: any) => void;

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      // update error state, which is responsible for displaying errors
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
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
}
