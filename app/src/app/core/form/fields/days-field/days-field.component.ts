import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Host,
  HostBinding,
  Inject,
  Input,
  Optional,
  Self,
  SkipSelf,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ErrorStateMatcher } from '@angular/material/core';

import { BaseFormComponentClass } from '../base-form-component-class';
import { IntToDayService } from '@core/form/services/int-to-day.service';
import { Day, days, DayType, ShortDayName } from '@core/form/consts/days-consts';

@Component({
  selector: 'ri-form-days-field',
  templateUrl: './days-field.component.html',
  styleUrls: ['./days-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DaysFieldComponent,
    },
  ],
})
export class DaysFieldComponent extends BaseFormComponentClass implements ControlValueAccessor {
  static nextId = 0;

  @Input()
  public type: DayType = 'short';

  @HostBinding()
  public id = `days-field-${DaysFieldComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }

  get empty() {
    return !this._value.some(val => val);
  }

  public controlType = 'days-field';

  public readonly days: Day[] = [...days];

  public readonly shortNames = ShortDayName;

  protected _value: boolean[] = [];

  public constructor(@Optional() @Self() public ngControl: NgControl,
                     @Optional() @Host() @SkipSelf() protected formGroupDirective: FormGroupDirective,
                     @Inject(ErrorStateMatcher) protected errorStateMatcher: ErrorStateMatcher,
                     protected fm: FocusMonitor,
                     protected elRef: ElementRef<HTMLElement>,
                     protected intToDaysService: IntToDayService) {
    super();

    this.monitorFocus();

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

  }

  public writeValue(value: number): void {
    this._value = this.intToDaysService.convertInt2Days(value);
  }

  public onContainerClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  public isPressed(index: number): boolean {
    return this._value && this._value[index];
  }

  public toggle(index: number): void {
    this._value[index] = !this._value[index];

    let value: number = this.intToDaysService.convertDays2Int(this._value);

    if (value === 0) {
      value = null;
    }

    this.onChange(value);
    this.onTouched(value);
    this.stateChanges.next();
  }

  public buttonName(day: string): string {
    return this.intToDaysService.getDayName(day, this.type);
  }
}
