import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[riLeadingZeroValue]',
})
export class LeadingZeroValueDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>) {
  }

  public ngAfterViewInit(): void {
    this.format(this.el.nativeElement.value || '0');
  }

  @HostListener('blur', ['$event.target.value'])
  public format(value: string): void {
    if (value.length >= 2) {
      return;
    }

    const newValue: number = parseInt(value, 10);

    if (newValue < 10) {
      this.el.nativeElement.value = '0' + value;
    } else {
      this.el.nativeElement.value = value;
    }
  }
}
