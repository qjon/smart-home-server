import { AfterViewInit, Attribute, Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[riRangeNumberValue]',
})
export class RangeNumberValueDirective {
  private readonly _min: number;
  private readonly _max: number;

  constructor(private el: ElementRef<HTMLInputElement>,
              @Optional() public ngModel: NgControl,
              @Attribute('min') private min: string,
              @Attribute('max') private max: string) {
    if (!ngModel) {
      throw new Error('riRangeNumberValue requires ngModel.');
    }

    if (!this.min) {
      throw new Error('riRangeNumberValue requires min attribute.');
    }

    if (!this.max) {
      throw new Error('riRangeNumberValue requires max attribute.');
    }

    this._max = parseInt(this.max, 10);
    this._min = parseInt(this.min, 10);
  }

  @HostListener('keyup', ['$event.target.value'])
  public check(value: string): void {
    if (value === '') {
      return;
    }

    const newValue: number = parseInt(value, 10);

    if ((value.length > this.max.length) || !(this._min <= newValue && newValue <= this._max)) {
      this.el.nativeElement.value = this.max;

      this.ngModel.control.setValue(this.el.nativeElement.value);
    }
  }
}
