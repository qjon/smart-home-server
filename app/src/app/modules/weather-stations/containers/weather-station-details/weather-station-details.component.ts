import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
        takeUntil(this.destroy$)
      )
      .subscribe((val => this.loadWeatherData(parseInt(val, 10))));
  }

  private listenOnDataChange(): void {
    this.weatherStationsStateConnectorService.data$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((items: WeatherStationDataDto[]) => {
        this.weatherStationChartDataParserService.setData(items);
      });
  }

  private listenOnChartDataChange(): void {
    combineLatest(
      this.weatherStationChartDataParserService.xAxis$,
      this.weatherStationChartDataParserService.seriesTemperature$,
      this.weatherStationChartDataParserService.seriesHumidity$,
    )
      .pipe(
        filter(([xAxis, seriesTemperature, seriesHumidity]) => {
          return xAxis.length > 0 && seriesTemperature.length > 0 && seriesHumidity.length > 0;
        }),
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
        text: `Last 7 days`,
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

  private loadWeatherData(weatherStationId: number): void {
    const to = Date.now();
    const from = to - 7 * 24 * 60 * 60 * 1000;

    this.weatherStationsStateConnectorService.setWeatherStationId(weatherStationId);
    this.weatherStationsStateConnectorService.loadData(from, to);

    this.cdr.markForCheck();
  }
}
