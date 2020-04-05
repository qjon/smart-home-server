import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';

import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { WeatherStationStateConnectorInterface } from '../../interfaces/weather-station-state-connector.interface';
import { WeatherStationsSelectors } from '../weather-stations-selectors';
import { WeatherStationsStoreModule } from '../weather-stations-store.module';
import {
  WeatherStationCompareAddAction,
  WeatherStationCompareEndAction, WeatherStationCompareRemoveAction,
  WeatherStationCompareStartAction,
  WeatherStationLoadAggregateDataAction,
  WeatherStationsLoadAction,
} from '../weather-stations-actions';
import { WeatherStationDataDto } from '../../interfaces/weather-station-data-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';
import { CompareWeatherStationButton } from '../../interfaces/compare-weather-station-button';
import { InputChartDataSeries } from '../../services/chart/weather-station-chart-data-parser.service';

@Injectable({
  providedIn: WeatherStationsStoreModule,
})
export class WeatherStationsStateConnectorService implements WeatherStationStateConnectorInterface {
  public compareList$: Observable<InputChartDataSeries[]>;

  public compareButtonList$: Observable<CompareWeatherStationButton[]>;

  public current$: Observable<WeatherStationDto>;

  public data$: Observable<WeatherStationDataDto[]>;

  public list$: Observable<WeatherStationDto[]>;

  private weatherStation: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private store: Store<any>) {

    this.compareButtonList$ = this.store
      .pipe(
        select(WeatherStationsSelectors.compareButtonList),
      );

    this.compareList$ = this.store
      .pipe(
        select(WeatherStationsSelectors.compareList),
      );

    this.list$ = this.store
      .pipe(
        select(WeatherStationsSelectors.list),
      );

    this.data$ = this.store
      .pipe(
        select(WeatherStationsSelectors.data),
        shareReplay()
      );

    this.current$ = combineLatest(
      this.weatherStation.asObservable(),
      this.list$,
    )
      .pipe(
        map(([weatherStationId, items]) => weatherStationId),
        switchMap((weatherStationId: number) => this.store
          .pipe(
            select(WeatherStationsSelectors.current, { weatherStationId }),
            first(),
          ),
        ),
      );
  }

  public addWeatherStationToCompare(weatherStationId: number, chartType: ChartType, date: Date): void {
    this.store.dispatch(new WeatherStationCompareAddAction({ weatherStationId, type: chartType, date }));
  }

  public loadList(): void {
    this.store.dispatch(new WeatherStationsLoadAction());
  }

  public loadAggregateData(type: ChartType.Day | ChartType.Week, year: number, month: number, day: number);
  public loadAggregateData(type: ChartType.Month, year: number, month: number);
  public loadAggregateData(type: ChartType.Year, year: number);
  public loadAggregateData(type: ChartType, year: number, month?: number, day?: number): void {
    let action: WeatherStationLoadAggregateDataAction;

    switch (type) {
      case ChartType.Day:
      case ChartType.Week:
        action = new WeatherStationLoadAggregateDataAction(type, this.weatherStation.getValue(), year, month, day);
        break;
      case ChartType.Month:
        action = new WeatherStationLoadAggregateDataAction(ChartType.Month, this.weatherStation.getValue(), year, month);
        break;
      case ChartType.Year:
        action = new WeatherStationLoadAggregateDataAction(ChartType.Year, this.weatherStation.getValue(), year);
        break;
    }

    this.store.dispatch(action);
  }

  public removeWeatherStationFromCompare(weatherStationId: number): void {
    this.store.dispatch(new WeatherStationCompareRemoveAction({weatherStationId}));
  }

  public setWeatherStationId(weatherStationId: number): void {
    this.weatherStation.next(weatherStationId);
  }

  public endCompare(): void {
    this.store.dispatch(new WeatherStationCompareEndAction());
  }

  public initCompare(weatherStationId: number): void {
    this.store.dispatch(new WeatherStationCompareStartAction({weatherStationId}));
  }
}
