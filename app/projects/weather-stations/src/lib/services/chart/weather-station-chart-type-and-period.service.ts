import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ChartType } from '../../interfaces/weather-station-chart-type';

@Injectable()
export class WeatherStationChartTypeAndPeriodService {
  public chartType$: Observable<ChartType>;

  public date$: Observable<Date>;

  private date: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  private chartType: BehaviorSubject<ChartType> = new BehaviorSubject<ChartType>(ChartType.Day);

  private now: Date = new Date();

  constructor() {
    this.date$ = this.date.asObservable();
    this.chartType$ = this.chartType.asObservable();
  }

  public changeChartType(type: ChartType): void {
    this.chartType.next(type);
  }

  public changePeriodOfTime(jump: number): void {
    const date: Date = this.date.getValue();

    switch (this.chartType.getValue()) {
      case ChartType.Year:
        date.setFullYear(date.getFullYear() + jump);
        break;
      case ChartType.Month:
        date.setDate(1);
        date.setMonth(date.getMonth() + jump);
        break;
      case ChartType.Week:
        date.setDate(date.getDate() + jump * 7);
        break;
      default:
        date.setDate(date.getDate() + jump);
    }

    this.date.next(date);
  }

  public isToday(): boolean {
    return this.now.toString() === this.date.getValue().toString();
  }

  public jumpToToday(): void {
    this.date.next(new Date(this.now.toString()));
  }
}
