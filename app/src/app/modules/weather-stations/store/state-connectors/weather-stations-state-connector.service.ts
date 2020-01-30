import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { first, map, switchMap } from 'rxjs/operators';

import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationStateConnectorInterface } from '@weather-stations/interfaces/weather-station-state-connector.interface';
import { WeatherStationsSelectors } from '@weather-stations/store/weather-stations-selectors';
import { WeatherStationsStoreModule } from '@weather-stations/store/weather-stations-store.module';
import {
  WeatherStationLoadAggregateDataForDayAction, WeatherStationLoadAggregateDataForWeekAction,
  WeatherStationLoadDataForMonthAction,
  WeatherStationLoadDataForYearAction,
  WeatherStationsLoadAction,
} from '@weather-stations/store/weather-stations-actions';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

@Injectable({
  providedIn: WeatherStationsStoreModule,
})
export class WeatherStationsStateConnectorService implements WeatherStationStateConnectorInterface {
  public current$: Observable<WeatherStationDto>;

  public list$: Observable<WeatherStationDto[]>;

  public data$: Observable<WeatherStationDataDto[]>;

  private weatherStation: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private store: Store<any>) {

    this.list$ = this.store
      .pipe(
        select(WeatherStationsSelectors.list),
      );

    this.data$ = this.store
      .pipe(
        select(WeatherStationsSelectors.data),
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

  public loadList(): void {
    this.store.dispatch(new WeatherStationsLoadAction());
  }


  public loadAggregateDataForDay(year: number, month: number, day: number): void {
    this.store.dispatch(new WeatherStationLoadAggregateDataForDayAction({
      weatherStationId: this.weatherStation.getValue(),
      year,
      month,
      day
    }));
  }


  public loadAggregateDataForWeek(year: number, month: number, day: number): void {
    this.store.dispatch(new WeatherStationLoadAggregateDataForWeekAction({
      weatherStationId: this.weatherStation.getValue(),
      year,
      month,
      day
    }));
  }

  public loadDataForMonth(year: number, month: number): void {
    this.store.dispatch(new WeatherStationLoadDataForMonthAction({
      weatherStationId: this.weatherStation.getValue(),
      year,
      month,
    }));
  }

  public loadDataForYear(year: number): void {
    this.store.dispatch(new WeatherStationLoadDataForYearAction({
      weatherStationId: this.weatherStation.getValue(),
      year,
    }));
  }

  public setWeatherStationId(weatherStationId: number): void {
    this.weatherStation.next(weatherStationId);
  }
}
