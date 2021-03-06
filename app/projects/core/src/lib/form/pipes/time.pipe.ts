import { Pipe, PipeTransform } from '@angular/core';
import { TimeValue } from '../fields/time-field/time-field.component';
import { LeadingZeroService } from '../services/leading-zero.service';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  constructor(private leadingZeroService: LeadingZeroService) {
  }

  public transform(value: TimeValue): string {
    return this.leadingZeroService.addZeros(value.hours.toString()) + ':' + this.leadingZeroService.addZeros(value.minutes.toString());
  }
}
