import { Injectable } from '@angular/core';
import { FormServicesModule } from './form-services.module';
import { DayType, LongDayName, MediumDayName, ShortDayName } from '../consts/days-consts';

@Injectable({
  providedIn: FormServicesModule,
})
export class IntToDayService {
  public convertInt2Days(value: number): boolean[] {
    const daysArr = value ? value.toString(2).split('').reverse().map((val) => val === '1') : [];

    while (daysArr.length < 7) {
      daysArr.push(false);
    }

    return daysArr;
  }

  public convertDays2Int(value: boolean[]): number {
    return value.reduce((prevValue: number, currentValue: boolean, index: number): number => {
      return prevValue + (+currentValue) * Math.pow(2, index);
    }, 0);
  }

  public getDayName(day: string, type: DayType): string {
    if (type === 'long') {
      return LongDayName[day];
    } else if (type === 'medium') {
      return MediumDayName[day];
    } else {
      return ShortDayName[day];
    }
  }
}
