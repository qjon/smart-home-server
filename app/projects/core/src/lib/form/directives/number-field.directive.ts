import { Attribute, Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[riNumberField]',
})
export class NumberFieldDirective {
  private readonly _min: number;
  private readonly _max: number;

  constructor(private el: ElementRef<HTMLInputElement>,
              @Optional() public ngControl: NgControl,
              @Attribute('min') private min: string,
              @Attribute('max') private max: string) {
    if (!ngControl) {
      throw new Error('riNumberField requires ngModel.');
    }

    if (!this.min) {
      throw new Error('riNumberField requires min attribute.');
    }

    if (!this.max) {
      throw new Error('riNumberField requires max attribute.');
    }

    this._max = parseInt(this.max, 10);
    this._min = parseInt(this.min, 10);
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if (event.which === 38) {
      this.changeValue(parseInt(this.ngControl.control.value, 10) + 1);
    } else if (event.which === 40) {
      this.changeValue(parseInt(this.ngControl.control.value, 10) - 1);
    }
  }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private changeValue(newValue: number): void {
    if (newValue < this._min) {
      this.ngControl.control.setValue(this.max);
    } else if (newValue > this._max) {
      this.ngControl.control.setValue(this.min);
    } else {
      this.ngControl.control.setValue(newValue);
    }
  }
}
