import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { BaseFormComponentClass } from '../base-form-component-class';
import { MatFormFieldControl } from '@angular/material/form-field';
import { takeUntil } from 'rxjs/operators';

export interface TimeValue {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'ri-form-time-field',
  templateUrl: './time-field.component.html',
  styleUrls: ['./time-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TimeFieldComponent,
    },
  ],
})
export class TimeFieldComponent extends BaseFormComponentClass implements ControlValueAccessor {
  static nextId = 0;

  @Input()
  public currentTime: boolean = true;

  @HostBinding()
  public id = `days-field-${TimeFieldComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }

  get empty() {
    return !!this._value;
  }

  public get minutes(): string {
    return this.formGroup.get('minutes').value;
  }

  public set minutes(value: string) {
    this.formGroup.get('minutes').setValue(value);
  }

  public controlType = 'time-field';

  public formGroup: FormGroup;

  protected _value: TimeValue = null;

  public constructor(@Optional() @Self() public ngControl: NgControl,
                     protected fm: FocusMonitor,
                     protected elRef: ElementRef<HTMLElement>,
                     protected fb: FormBuilder) {
    super();

    this.monitorFocus();

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    const now: Date = new Date();

    this.formGroup = this.fb.group({
      hours: [this.currentTime ? now.getHours() : 0],
      minutes: [this.currentTime ? now.getMinutes() : 0],
    });

    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        const newValue: TimeValue = {
          hours: parseInt(value.hours, 10),
          minutes: parseInt(value.minutes, 10),
        };

        this.onChange(newValue);
        this.onTouched(newValue);
        this.stateChanges.next();
      });
  }

  public writeValue(value: TimeValue): void {
    this._value = value;

    if (value) {
      this.formGroup.setValue(value);
    }
  }

  public onContainerClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

}
