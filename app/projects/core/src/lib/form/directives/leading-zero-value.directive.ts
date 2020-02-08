import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';
import { LeadingZeroService } from '../services/leading-zero.service';

@Directive({
  selector: '[riLeadingZeroValue]',
})
export class LeadingZeroValueDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>,
              protected leadingZeroService: LeadingZeroService) {
  }

  public ngAfterViewInit(): void {
    this.format(this.el.nativeElement.value || '0');
  }

  @HostListener('blur', ['$event.target.value'])
  public format(value: string): void {
    this.el.nativeElement.value = this.leadingZeroService.addZeros(value);
  }
}
