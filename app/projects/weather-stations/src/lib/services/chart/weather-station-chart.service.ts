import { Injectable } from '@angular/core';

import { Chart } from 'angular-highcharts';
import { Observable, Subject } from 'rxjs';

import { WeatherStationsServicesModule } from '../weather-stations-services.module';

@Injectable({
  providedIn: WeatherStationsServicesModule,
})
export class WeatherStationChartService {

  public refresh$: Observable<void>;

  private chart: Chart;

  private _refresh = new Subject<void>();

  constructor() {
    this.refresh$ = this._refresh.asObservable();
  }

  public init(title: string, xAxis: string[]): Chart {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart({
      chart: {
        type: 'line',
      },
      colors: ['#df9c12', '#3498c7', '#865e0b', '#1f5b77', '#ecc471', '#85c1dd'],
      title: {
        text: title,
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: xAxis,
      },
      yAxis: {
        title: {
          text: 'Temperature (°C), Humidity (%)',
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: true,
        },
      },
    });

    return this.chart;
  }

  public getChart(): Chart {
    return this.chart;
  }

  public refresh(): void {
    this._refresh.next();
  }
}
