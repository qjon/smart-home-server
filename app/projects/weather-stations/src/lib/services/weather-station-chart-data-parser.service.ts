import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Observable, Subject } from 'rxjs';

import { Destroyable } from '@rign/sh-core';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { ChartType } from '../interfaces/weather-station-chart-type';

interface ChartData {
  xAxis: string[];
  seriesTemperature: number[];
  seriesHumidity: number[];
}

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

  public setData(type: ChartType, data: WeatherStationDataDto[]): void {
    let chartData: ChartData;

    switch (type) {
      case ChartType.Year:
        chartData = this.parseYearData(data);
        break;
      case ChartType.Month:
        chartData = this.parseMonthData(data);
        break;
      case ChartType.Day:
        chartData = this.parseDayData(data);
        break;
      default:
        chartData = this.parseWeekData(data);
    }

    this.xAxis.next(chartData.xAxis);
    this.seriesTemperature.next(chartData.seriesTemperature);
    this.seriesHumidity.next(chartData.seriesHumidity);
  }

  private parseDayData(data: WeatherStationDataDto[]): ChartData {
    const xAxis: string[] = [];
    const seriesTemperature: number[] = [];
    const seriesHumidity: number[] = [];

    data.forEach((item: WeatherStationDataDto, index) => {
      xAxis.push(this.datePipe.transform(item.timestamp, 'HH'));
      seriesTemperature.push(item.temperature);
      seriesHumidity.push(item.humidity);
    });

    return { xAxis, seriesHumidity, seriesTemperature };
  }

  private parseWeekData(data: WeatherStationDataDto[]): ChartData {
    const xAxis: string[] = [];
    const seriesTemperature: number[] = [];
    const seriesHumidity: number[] = [];

    data.forEach((item: WeatherStationDataDto, index) => {
      xAxis.push(this.datePipe.transform(item.timestamp, 'dd'));
      seriesTemperature.push(item.temperature);
      seriesHumidity.push(item.humidity);
    });

    return { xAxis, seriesHumidity, seriesTemperature };
  }

  private parseMonthData(data: WeatherStationDataDto[]): ChartData {
    const xAxis: string[] = [];
    const seriesTemperature: number[] = [];
    const seriesHumidity: number[] = [];

    data.forEach((item: WeatherStationDataDto, index) => {
      xAxis.push(this.datePipe.transform(item.timestamp, 'dd MMM'));
      seriesTemperature.push(item.temperature);
      seriesHumidity.push(item.humidity);
    });

    return { xAxis, seriesHumidity, seriesTemperature };
  }

  private parseYearData(data: WeatherStationDataDto[]): ChartData {
    const xAxis: string[] = [];
    const seriesTemperature: number[] = [];
    const seriesHumidity: number[] = [];

    data.forEach((item: WeatherStationDataDto, index) => {
      xAxis.push(this.datePipe.transform(item.timestamp, 'MMM'));
      seriesTemperature.push(item.temperature);
      seriesHumidity.push(item.humidity);
    });

    return { xAxis, seriesHumidity, seriesTemperature };
  }
}
