import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';

import { Destroyable } from '@rign/sh-core';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationChartDataParserService } from '../../services/weather-station-chart-data-parser.service';
import { WeatherStationDataDto } from '../../interfaces/weather-station-data-dto';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';

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

  public now: Date = new Date();

  public date: Date = new Date(this.now.toString());

  constructor(private weatherStationChartDataParserService: WeatherStationChartDataParserService,
              private weatherStationsStateConnectorService: WeatherStationsStateConnectorService,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,
              private cdr: ChangeDetectorRef,
              private router: Router) {
    super();

    this.weatherStation$ = this.weatherStationsStateConnectorService.current$;
  }

  public back(): void {
    this.router.navigate(['..'], {relativeTo: this.activatedRoute});
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

  public goNext(): void {
    this.changePeriodOfType(1);
  }

  public goPrev(): void {
    this.changePeriodOfType(-1);
  }

  public goToday(): void {
    this.date = new Date(this.now.toString());

    this.currentChartType = ChartType.Day;

    this.loadDataByChartType(this.currentChartType);
  }

  public changePeriodOfType(jump: number): void {
    switch (this.currentChartType) {
      case ChartType.Year:
        this.date.setFullYear(this.date.getFullYear() + jump);
        break;
      case ChartType.Month:
        this.date.setDate(1);
        this.date.setMonth(this.date.getMonth() + jump);
        break;
      case ChartType.Week:
        this.date.setDate(this.date.getDate() + jump * 7);
        break;
      default:
        this.date.setDate(this.date.getDate() + jump);
    }

    this.loadDataByChartType(this.currentChartType);
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
        return 'Year: ' + this.date.getFullYear();
      case ChartType.Month:
        return this.datePipe.transform(this.date, 'MMM yyyy');
      case ChartType.Day:
        return this.datePipe.transform(this.date, 'dd MMM yyyy');
      default:
        const startOfWeek = new Date(this.date.toString());
        startOfWeek.setDate(startOfWeek.getDate() - 6);

        return this.datePipe.transform(startOfWeek, 'dd-MMM yyyy') + ' - ' + this.datePipe.transform(this.date, 'dd-MMM yyyy');
    }
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

  private listenOnDataChange(): void {
    this.weatherStationsStateConnectorService.data$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((items: WeatherStationDataDto[]) => {
        this.weatherStationChartDataParserService.setData(this.currentChartType, items);
      });
  }

  private loadDataByChartType(chartType: ChartType): void {
    switch (chartType) {
      case ChartType.Year:
        this.weatherStationsStateConnectorService.loadDataForYear(this.date.getFullYear());
        break;
      case ChartType.Month:
        this.weatherStationsStateConnectorService.loadDataForMonth(this.date.getFullYear(), this.date.getMonth());
        break;
      case ChartType.Day:
        this.weatherStationsStateConnectorService.loadAggregateDataForDay(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
        break;
      default:
        const from = new Date(this.date.toString());
        from.setDate(from.getDate() - 6);

        this.weatherStationsStateConnectorService.loadAggregateDataForWeek(from.getFullYear(), from.getMonth(), from.getDate());
    }

    this.cdr.markForCheck();
  }
}
