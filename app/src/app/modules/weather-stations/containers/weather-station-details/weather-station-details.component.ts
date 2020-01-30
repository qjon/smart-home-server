import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';

import { Destroyable } from '@core/classes/destroyable.component';
import { WeatherStationsStateConnectorService } from '@weather-stations/store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationChartDataParserService } from '@weather-stations/services/weather-station-chart-data-parser.service';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ChartType } from '@weather-stations/interfaces/weather-station-chart-type';

@Component({
  selector: 'sh-weather-station-details',
  templateUrl: './weather-station-details.component.html',
  styleUrls: ['./weather-station-details.component.scss'],
  providers: [
    WeatherStationChartDataParserService,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationDetailsComponent extends Destroyable implements OnInit {
  public chart: Chart;

  public chartTypes: typeof ChartType = ChartType;

  public currentChartType: ChartType = ChartType.Day;

  public weatherStation$: Observable<WeatherStationDto>;

  constructor(private weatherStationChartDataParserService: WeatherStationChartDataParserService,
              private weatherStationsStateConnectorService: WeatherStationsStateConnectorService,
              private activatedRoute: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
    super();

    this.weatherStation$ = this.weatherStationsStateConnectorService.current$;
  }

  public ngOnInit(): void {
    this.listenOnChartDataChange();
    this.listenOnDataChange();

    this.activatedRoute.paramMap
      .pipe(
        map((paramsMap) => paramsMap.get('weatherStationId')),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((val => {
        this.weatherStationsStateConnectorService.setWeatherStationId(parseInt(val, 10));

        this.loadDataByChartType(this.currentChartType);
      }));
  }

  public onChangeChartType(value: ChartType): void {
    this.currentChartType = value;

    this.loadDataByChartType(this.currentChartType);
  }

  private listenOnDataChange(): void {
    this.weatherStationsStateConnectorService.data$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((items: WeatherStationDataDto[]) => {
        this.weatherStationChartDataParserService.setData(this.currentChartType, items);
      });
  }

  private listenOnChartDataChange(): void {
    combineLatest(
      this.weatherStationChartDataParserService.xAxis$,
      this.weatherStationChartDataParserService.seriesTemperature$,
      this.weatherStationChartDataParserService.seriesHumidity$,
    )
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(([xAxis, seriesTemperature, seriesHumidity]) => {
        this.chart = this.getChart(xAxis, seriesTemperature, seriesHumidity);

        this.cdr.detectChanges();
      });
  }

  private getChart(xAxis: string[], seriesTemperature: number[], seriesHumidity: number[]): Chart {
    return new Chart({
      chart: {
        type: 'line',
      },
      colors: ['#f39c12', '#3498db'],
      title: {
        text: this.getChartTitle(),
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
      series: [
        <any>{
          name: 'Temperature',
          data: seriesTemperature,
        },
        <any>{
          name: 'Humidity',
          data: seriesHumidity,
        },
      ],
    });
  }
  private getChartTitle(): string {
    switch (this.currentChartType) {
      case ChartType.Year:
        return 'Last Year';
      case ChartType.Month:
        return 'Last Month';
      case ChartType.Day:
        return 'Day';
      default:
        return 'Last 7 days';
    }
  }

  private loadDataByChartType(chartType: ChartType): void {
    const now: Date = new Date();

    switch (chartType) {
      case ChartType.Year:
        this.weatherStationsStateConnectorService.loadDataForYear(now.getFullYear());
        break;
      case ChartType.Month:
        this.weatherStationsStateConnectorService.loadDataForMonth(now.getFullYear(), now.getMonth());
        break;
      case ChartType.Day:
        this.weatherStationsStateConnectorService.loadAggregateDataForDay(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      default:
        const from = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
        this.weatherStationsStateConnectorService.loadAggregateDataForWeek(from.getFullYear(), from.getMonth(), from.getDate());
    }

    this.cdr.markForCheck();
  }
}
