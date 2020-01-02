import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BaseFormComponentClass } from '../base-form-component-class';

export enum Days {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum ShortDayName {
  Monday = 'M',
  Tuesday = 'T',
  Wednesday = 'W',
  Thursday = 'T',
  Friday = 'F',
  Saturday = 'S',
  Sunday = 'S',
}

export enum MediumDayName {
  Monday = 'Mon',
  Tuesday = 'Tue',
  Wednesday = 'Wed',
  Thursday = 'Thu',
  Friday = 'Fri',
  Saturday = 'Sat',
  Sunday = 'Sun',
}

export enum LongDayName {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum DayValue {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 4,
  Thursday = 8,
  Friday = 16,
  Saturday = 32,
  Sunday = 64,
}

export interface Day {
  symbol: Days;
  value: DayValue;
}

const days: Day[] = [
  {
    symbol: Days.Monday,
    value: DayValue.Monday,
  },
  {
    symbol: Days.Tuesday,
    value: DayValue.Tuesday,
  },
  {
    symbol: Days.Wednesday,
    value: DayValue.Wednesday,
  },
  {
    symbol: Days.Thursday,
    value: DayValue.Thursday,
  },
  {
    symbol: Days.Friday,
    value: DayValue.Friday,
  },
  {
    symbol: Days.Saturday,
    value: DayValue.Saturday,
  },
  {
    symbol: Days.Sunday,
    value: DayValue.Sunday,
  },
];

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
  public type: 'short' | 'medium' | 'long' = 'short';

  @HostBinding()
  public id = `days-field-${DaysFieldComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }

  get empty() {
    return this._value.some(val => val);
  }

  public controlType = 'days-field';

  public readonly days: Day[] = days;

  public readonly shortNames = ShortDayName;

  protected _value: boolean[] = [];

  public constructor(@Optional() @Self() public ngControl: NgControl,
                     protected fm: FocusMonitor,
                     protected elRef: ElementRef<HTMLElement>) {
    super();

    this.monitorFocus();

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  public writeValue(value: number): void {
    this._value = value.toString(2).split('').reverse().map((val) => val === '1');

    while (this._value.length < 7) {
      this._value.push(false);
    }
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

    let value: number = this.countValue(this._value);

    if (value === 0) {
      value = null;
    }

    this.onChange(value);
    this.onTouched(value);
    this.stateChanges.next();
  }

  public buttonName(day: string): string {
    if (this.type === 'long') {
      return LongDayName[day];
    } else if (this.type === 'medium') {
      return MediumDayName[day];
    } else {
      return ShortDayName[day];
    }
  }

  private countValue(value: boolean[]): number {
    return value.reduce((prevValue: number, currentValue: boolean, index: number): number => {
      return prevValue + (+currentValue) * Math.pow(2, index);
    }, 0);
  }
}
