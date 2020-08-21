import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Chart } from 'angular-highcharts';

import { WeatherStationChartTypeAndPeriodService } from '../../services/chart/weather-station-chart-type-and-period.service';

@Component({
  selector: 'sh-weather-station-chart',
  templateUrl: './weather-station-chart.component.html',
  styleUrls: ['./weather-station-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationChartComponent {

  @Input()
  public chartObject: Chart;

  constructor(private weatherStationChartTypeAndPeriodService: WeatherStationChartTypeAndPeriodService) {
  }

  public goNext(): void {
    this.weatherStationChartTypeAndPeriodService.changePeriodOfTime(1);
  }

  public goPrev(): void {
    this.weatherStationChartTypeAndPeriodService.changePeriodOfTime(-1);
  }
}
