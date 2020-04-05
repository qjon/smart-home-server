import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Destroyable } from '@rign/sh-core';

import { Chart } from 'angular-highcharts';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import {
  ChartDataSeries, InputChartDataSeries,
  WeatherStationChartDataParserService,
} from '../../services/chart/weather-station-chart-data-parser.service';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationChartService } from '../../services/chart/weather-station-chart.service';
import { WeatherStationChartTypeAndPeriodService } from '../../services/chart/weather-station-chart-type-and-period.service';
import { WeatherStationDataDto } from '../../interfaces/weather-station-data-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';

@Component({
  selector: 'sh-weather-station-details-chart',
  templateUrl: './weather-station-details-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationDetailsChartComponent extends Destroyable implements OnInit {
  @Output()
  public compare: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isCompare = false;

  public chart: Chart;

  private weatherStationId: number;

  constructor(private weatherStationChartDataParserService: WeatherStationChartDataParserService,
              private weatherStationsStateConnectorService: WeatherStationsStateConnectorService,
              public weatherStationChartTypeAndPeriodService: WeatherStationChartTypeAndPeriodService,
              private weatherStationChartService: WeatherStationChartService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.weatherStationsStateConnectorService.current$
      .pipe(
        map((weatherStation: WeatherStationDataDto) => weatherStation.id),
        takeUntil(this.destroy$),
      )
      .subscribe((weatherStationId: number) => this.weatherStationId = weatherStationId);

    this.listenOnChartDataChange();
    this.listenOnRefresh();

    this.weatherStationChartService.refresh();
  }

  public toggleCompare(isCompare: boolean): void {
    this.isCompare = isCompare;

    if (isCompare) {
      this.weatherStationsStateConnectorService.initCompare(this.weatherStationId);
    } else {
      this.weatherStationsStateConnectorService.endCompare();
    }

    this.weatherStationChartService.refresh();
    this.compare.emit(this.isCompare);
  }

  private listenOnRefresh(): void {
    const combinedData$ = combineLatest(
      this.weatherStationsStateConnectorService.data$
        .pipe(distinctUntilChanged((x, y) => isEqual(x, y))),
      this.weatherStationsStateConnectorService.compareList$
        .pipe(distinctUntilChanged((x, y) => isEqual(x, y))),
      this.weatherStationChartTypeAndPeriodService.chartType$
        .pipe(distinctUntilChanged()),
      this.weatherStationChartTypeAndPeriodService.date$
        .pipe(distinctUntilChanged((x, y) => isEqual(x, y))),
    );

    this.weatherStationChartService.refresh$
      .pipe(
        switchMap(() => combinedData$
          .pipe(
            map(([items, comparedItems, chartType, date]: [WeatherStationDataDto[], InputChartDataSeries[], ChartType, Date]) => {
              return [
                this.isCompare ? comparedItems : [{ name: null, data: items }],
                chartType,
                date,
              ];
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(([items, chartType, date]: [InputChartDataSeries[], ChartType, Date]) => {
        this.weatherStationChartDataParserService.setData(chartType, new Date(date), items);
      });
  }

  private listenOnChartDataChange() {

    this.weatherStationChartDataParserService.dataSeries$
      .pipe(
        withLatestFrom(combineLatest(
          this.weatherStationChartDataParserService.xAxis$,
          this.weatherStationChartTypeAndPeriodService.date$,
          this.weatherStationChartTypeAndPeriodService.chartType$)
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(([dataSeries, [xAxis, date, chartType]]) => {
        this.chart = this.getChart(chartType, date, xAxis, dataSeries);

        this.cdr.detectChanges();
      });
  }

  private getChart(chartType, date, xAxis, dataSeries: ChartDataSeries[]): Chart {
    const chart: Chart = this.weatherStationChartService.init(this.weatherStationChartDataParserService.getChartTitle(chartType, date), xAxis);

    dataSeries.forEach((series: ChartDataSeries, index) => {
      chart.addSeries(
        <any>{
          name: series.name,
          data: series.data,
        },
        index === dataSeries.length - 1,
        false,
      );
    });

    return chart;
  }
}
