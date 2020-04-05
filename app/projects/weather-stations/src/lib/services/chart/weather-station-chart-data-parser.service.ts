import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Destroyable } from '@rign/sh-core';

import { Observable, Subject } from 'rxjs';

import { WeatherStationDataDto } from '../../interfaces/weather-station-data-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';
import { WeatherStationChartXAxisGeneratorService } from './weather-station-chart-x-axis-generator.service';

export interface ChartDataSeries {
  name: string;
  data: number[];
}

export interface InputChartDataSeries {
  name: string;
  data: WeatherStationDataDto[];
}

@Injectable()
export class WeatherStationChartDataParserService extends Destroyable {
  public xAxis$: Observable<string[]>;
  public dataSeries$: Observable<ChartDataSeries[]>;

  private xAxis: Subject<string[]> = new Subject<string[]>();
  private dataSeries: Subject<ChartDataSeries[]> = new Subject<ChartDataSeries[]>();

  constructor(private datePipe: DatePipe,
              private weatherStationChartXAxisGeneratorService: WeatherStationChartXAxisGeneratorService) {
    super();

    this.xAxis$ = this.xAxis.asObservable();
    this.dataSeries$ = this.dataSeries.asObservable();
  }

  public getChartTitle(type: ChartType, date: Date): string {
    switch (type) {
      case ChartType.Year:
        return 'Year: ' + date.getFullYear();
      case ChartType.Month:
        return this.datePipe.transform(date, 'MMM yyyy');
      case ChartType.Day:
        return this.datePipe.transform(date, 'dd MMM yyyy');
      default:
        const startOfWeek = new Date(date.toString());
        startOfWeek.setDate(startOfWeek.getDate() - 6);

        return this.datePipe.transform(startOfWeek, 'dd-MMM yyyy') + ' - ' + this.datePipe.transform(date, 'dd-MMM yyyy');
    }
  }

  public setData(type: ChartType, date: Date, data: InputChartDataSeries[]): void {
    let chartData: ChartDataSeries[];
    let xAxis: string[];

    switch (type) {
      case ChartType.Year:
        xAxis = this.weatherStationChartXAxisGeneratorService.getXAxisDataForYear();
        break;
      case ChartType.Month:
        xAxis = this.weatherStationChartXAxisGeneratorService.getXAxisDataForMonth(date.getFullYear(), date.getMonth());
        break;
      case ChartType.Week:
        xAxis = this.weatherStationChartXAxisGeneratorService.getXAxisDataForWeak(date);
        break;
      default:
        xAxis = this.weatherStationChartXAxisGeneratorService.getXAxisDataForDay();
    }

    chartData = this.parseSeriesData(type, date, data, xAxis);

    this.xAxis.next(xAxis);
    this.dataSeries.next(chartData);
  }

  private parseSeriesData(chartType: ChartType, date: Date, inputData: InputChartDataSeries[], xAxis: string[]): ChartDataSeries[] {
    const dataSeriesList: ChartDataSeries[] = [];

    inputData.forEach((series: InputChartDataSeries) => {
      const dataSeriesTemp = this.prepareEmptySeriesData(series.name ? series.name + ' (Temp)' : 'Temperature', xAxis);
      const dataSeriesHum = this.prepareEmptySeriesData(series.name ? series.name + ' (Hum)' : 'Humidity', xAxis);

      series.data.forEach((item: WeatherStationDataDto, index) => {
        const dataPosition: number = this.getDataPosition(chartType, item.timestamp, xAxis);
        dataSeriesTemp.data[dataPosition] = item.temperature;
        dataSeriesHum.data[dataPosition] = item.humidity;
      });

      dataSeriesList.push(dataSeriesTemp);
      dataSeriesList.push(dataSeriesHum);
    });

    return dataSeriesList;
  }

  private getDataPosition(chartType: ChartType, time: number, xAxis: string[]): number {
    switch (chartType) {
      case ChartType.Year:
        return parseInt(this.datePipe.transform(time, 'M'), 10) - 1;
      case ChartType.Month:
        return parseInt(this.datePipe.transform(time, 'd'), 10) - 1;
      case ChartType.Week:
        const xAxisValue = this.datePipe.transform(time, 'dd MMM');
        return xAxis.indexOf(xAxisValue);
      default:
        return parseInt(this.datePipe.transform(time, 'H'), 10);
    }
  }

  private prepareEmptySeriesData(name: string, xAxis: string[]): ChartDataSeries {
    const data: number[] = [];

    xAxis.forEach(() => {
      data.push(null);
    });

    return { name, data };
  }
}
