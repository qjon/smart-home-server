import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { WeatherStationsServicesModule } from '../weather-stations-services.module';

@Injectable({
  providedIn: WeatherStationsServicesModule,
})
export class WeatherStationChartXAxisGeneratorService {

  public constructor(private datePipe: DatePipe) {
  }

  public getXAxisDataForDay(): string[] {
    const data: string[] = [];

    for (let i = 0; i < 24; i++) {
      data.push(i < 10 ? `0${i}` : i.toString());
    }

    return data;
  }

  public getXAxisDataForMonth(year: number, month: number): string[] {
    const date = new Date(year, month + 1, 0);

    const data: string[] = [];

    for (let i = 1; i <= date.getDate(); i++) {
      data.push(i.toString());
    }

    return data;
  }

  public getXAxisDataForWeak(date: Date): string[] {
    const data: string[] = [];
    const changedDate = new Date(date);

    for (let i = 0; i < 7; i++) {
      changedDate.setDate(date.getDate() - i);
      data.unshift(this.datePipe.transform(changedDate, 'dd MMM'));
    }

    return data;
  }

  public getXAxisDataForYear(): string[] {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  }
}
