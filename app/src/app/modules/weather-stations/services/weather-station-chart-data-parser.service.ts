import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Observable, Subject } from 'rxjs';

import { Destroyable } from '@core/classes/destroyable.component';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

@Injectable()
export class WeatherStationChartDataParserService extends Destroyable {

  public xAxis$: Observable<string[]>;
  public seriesTemperature$: Observable<number[]>;
  public seriesHumidity$: Observable<number[]>;

  private xAxis: Subject<string[]> = new Subject<string[]>();
  private seriesTemperature: Subject<number[]> = new Subject<number[]>();
  private seriesHumidity: Subject<number[]> = new Subject<number[]>();

  constructor(private datePipe: DatePipe) {
    super();

    this.xAxis$ = this.xAxis.asObservable();
    this.seriesTemperature$ = this.seriesTemperature.asObservable();
    this.seriesHumidity$ = this.seriesHumidity.asObservable();
  }

  public setData(data: WeatherStationDataDto[]): void {
    const xAxis: string[] = [];
    const seriesTemperature: number[] = [];
    const seriesHumidity: number[] = [];

    data.forEach((item: WeatherStationDataDto, index) => {
      xAxis.push(this.datePipe.transform(item.timestamp, 'dd MMM HH:mm'));
      seriesTemperature.push(item.temperature);
      seriesHumidity.push(item.humidity);
    });

    this.xAxis.next(xAxis);
    this.seriesTemperature.next(seriesTemperature);
    this.seriesHumidity.next(seriesHumidity);
  }
}
