import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Destroyable } from '@rign/sh-core';

import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationChartDataParserService } from '../../services/chart/weather-station-chart-data-parser.service';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';
import { WeatherStationChartTypeAndPeriodService } from '../../services/chart/weather-station-chart-type-and-period.service';
import { CompareWeatherStationButton } from '../../interfaces/compare-weather-station-button';

@Component({
  selector: 'sh-weather-station-details',
  templateUrl: './weather-station-details.component.html',
  styleUrls: ['./weather-station-details.component.scss'],
  providers: [
    WeatherStationChartDataParserService,
    DatePipe,
    WeatherStationChartTypeAndPeriodService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationDetailsComponent extends Destroyable implements OnInit {

  public chartTypes: typeof ChartType = ChartType;

  public currentChartType: ChartType = ChartType.Day;

  public weatherStation$: Observable<WeatherStationDto>;

  private date: Date;
  private isCompareMode: boolean = false;

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public weatherStationChartTypeAndPeriodService: WeatherStationChartTypeAndPeriodService) {
    super();

    this.weatherStation$ = this.weatherStationsStateConnectorService.current$;
  }

  public back(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  public ngOnInit(): void {
    this.listenOnDateChange();
    this.listenOnChartTypeChange();
    this.listenOnParamsChange();
  }

  private listenOnChartTypeChange(): void {
    this.weatherStationChartTypeAndPeriodService.chartType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.currentChartType = type);
  }

  private listenOnDateChange(): void {
    this.weatherStationChartTypeAndPeriodService
      .date$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(date => this.date = date);
  }

  private listenOnParamsChange(): void {
    combineLatest(
      this.weatherStationsStateConnectorService.current$
        .pipe(
          filter(Boolean),
          map((weatherStation: WeatherStationDto) => weatherStation.id),
          distinctUntilChanged(),
        ),
      this.weatherStationChartTypeAndPeriodService.date$,
      this.weatherStationChartTypeAndPeriodService.chartType$,
    )

      .pipe(
        filter(() => !this.isCompareMode),
        takeUntil(this.destroy$),
      )
      .subscribe(([val, date, chartType]: [number, Date, ChartType]) => {
        this.loadDataByChartType(chartType, date);
      });


    combineLatest(
      this.weatherStationChartTypeAndPeriodService.date$,
      this.weatherStationChartTypeAndPeriodService.chartType$,
    )

      .pipe(
        withLatestFrom(this.weatherStationsStateConnectorService.compareButtonList$),
        filter(() => this.isCompareMode),
        takeUntil(this.destroy$),
      )
      .subscribe(([[date, chartType], compareList]: [[Date, ChartType], CompareWeatherStationButton[]]) => {
        const startFromDate: Date = new Date(date);

        if (chartType === ChartType.Week) {
          startFromDate.setDate(startFromDate.getDate() - 6);
        }

        compareList
          .filter((button) => button.isAdded)
          .forEach((button: CompareWeatherStationButton) => {
            this.weatherStationsStateConnectorService.addWeatherStationToCompare(button.id, chartType, startFromDate);
          });
      });
  }

  public goToday(): void {
    this.weatherStationChartTypeAndPeriodService.jumpToToday();
    this.weatherStationChartTypeAndPeriodService.changeChartType(ChartType.Day);
  }

  private loadDataByChartType(chartType: ChartType, date: Date): void {
    switch (chartType) {
      case ChartType.Year:
        this.weatherStationsStateConnectorService.loadAggregateData(chartType, date.getFullYear());
        break;
      case ChartType.Month:
        this.weatherStationsStateConnectorService.loadAggregateData(chartType, date.getFullYear(), date.getMonth());
        break;
      case ChartType.Week:
        const from = new Date(date.toString());
        from.setDate(from.getDate() - 6);

        this.weatherStationsStateConnectorService.loadAggregateData(chartType, from.getFullYear(), from.getMonth(), from.getDate());
        break;
      case ChartType.Day:
        this.weatherStationsStateConnectorService.loadAggregateData(chartType, date.getFullYear(), date.getMonth(), date.getDate());
        break;
    }
  }

  public setCompareMode(isCompare: boolean): void {
    this.isCompareMode = isCompare;
  }
}
