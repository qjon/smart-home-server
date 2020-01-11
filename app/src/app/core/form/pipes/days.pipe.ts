import { Pipe, PipeTransform } from '@angular/core';
import { IntToDayService } from '@core/form/services/int-to-day.service';
import { days, DayType } from '@core/form/consts/days-consts';

@Pipe({
  name: 'days',
})
export class DaysPipe implements PipeTransform {

  constructor(private intToDaysService: IntToDayService) {
  }

  public transform(value: number, dayType: DayType = 'medium'): any {
    const localDays = [...days];
    const daysMap = this.intToDaysService.convertInt2Days(value)
      .map((day: boolean, index) => {
        return day ? this.intToDaysService.getDayName(localDays[index].symbol, dayType) : false;
      })
      .filter(v => v);

    return daysMap.join(', ');
  }
}
