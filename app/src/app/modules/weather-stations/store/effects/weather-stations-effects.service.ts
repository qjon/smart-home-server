import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  WeatherStationLoadAggregateDataForDayAction,
  WeatherStationLoadAggregateDataForDayErrorAction,
  WeatherStationLoadAggregateDataForDaySuccessAction,
  WeatherStationLoadAggregateDataForWeekAction, WeatherStationLoadAggregateDataForWeekErrorAction,
  WeatherStationLoadAggregateDataForWeekSuccessAction,
  WeatherStationLoadDataForMonthAction,
  WeatherStationLoadDataForMonthErrorAction,
  WeatherStationLoadDataForMonthSuccessAction,
  WeatherStationLoadDataForYearAction,
  WeatherStationLoadDataForYearErrorAction,
  WeatherStationLoadDataForYearSuccessAction,
  WeatherStationsActionTypes,
  WeatherStationsLoadErrorAction,
  WeatherStationsLoadSuccessAction,
} from '@weather-stations/store/weather-stations-actions';
import { WeatherStationsApiService } from '@weather-stations/api/weather-stations-api.service';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

@Injectable()
export class WeatherStationsEffectsService {

  @Effect({
    dispatch: true,
  })
  public loadWeatherStations$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStations),
      switchMap(() => this.weatherStationsApiService.getList()),
      map((items: WeatherStationDto[]) => new WeatherStationsLoadSuccessAction({ items })),
      catchError((error: any) => of(new WeatherStationsLoadErrorAction({ error }))),
    );

  @Effect({
    dispatch: true,
  })
  public loadWeatherStationsMonthData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationsDataForMonth),
      switchMap((action: WeatherStationLoadDataForMonthAction) => this.weatherStationsApiService.getAggregateDataForMonth(action.payload.weatherStationId, action.payload.year, action.payload.month)
        .pipe(
          map((items: WeatherStationDataDto[]) => new WeatherStationLoadDataForMonthSuccessAction({
            weatherStationId: action.payload.weatherStationId,
            year: action.payload.year,
            month: action.payload.month,
            items,
          })),
          catchError((error: any) => of(new WeatherStationLoadDataForMonthErrorAction({ error }))),
        ),
      ),
    );

  @Effect({
    dispatch: true,
  })
  public loadWeatherStationsAggregatedDayData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationsAggregateDataForDay),
      switchMap((action: WeatherStationLoadAggregateDataForDayAction) => this.weatherStationsApiService.getAggregateDataForDay(
        action.payload.weatherStationId,
        action.payload.year,
        action.payload.month,
        action.payload.day
        )
          .pipe(
            map((items: WeatherStationDataDto[]) => new WeatherStationLoadAggregateDataForDaySuccessAction({
              weatherStationId: action.payload.weatherStationId,
              year: action.payload.year,
              month: action.payload.month,
              day: action.payload.day,
              items,
            })),
            catchError((error: any) => of(new WeatherStationLoadAggregateDataForDayErrorAction({ error }))),
          ),
      ),
    );

  @Effect({
    dispatch: true,
  })
  public loadWeatherStationsAggregatedWeekData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationsAggregateDataForWeek),
      switchMap((action: WeatherStationLoadAggregateDataForWeekAction) => this.weatherStationsApiService.getAggregateDataForWeek(
        action.payload.weatherStationId,
        action.payload.year,
        action.payload.month,
        action.payload.day
        )
          .pipe(
            map((items: WeatherStationDataDto[]) => new WeatherStationLoadAggregateDataForWeekSuccessAction({
              weatherStationId: action.payload.weatherStationId,
              year: action.payload.year,
              month: action.payload.month,
              day: action.payload.day,
              items,
            })),
            catchError((error: any) => of(new WeatherStationLoadAggregateDataForWeekErrorAction({ error }))),
          ),
      ),
    );

  @Effect({
    dispatch: true,
  })
  public loadWeatherStationsYearData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationsDataForYear),
      switchMap((action: WeatherStationLoadDataForYearAction) => this.weatherStationsApiService.getAggregateDataForYear(action.payload.weatherStationId, action.payload.year)
        .pipe(
          map((items: WeatherStationDataDto[]) => new WeatherStationLoadDataForYearSuccessAction({
            weatherStationId: action.payload.weatherStationId,
            year: action.payload.year,
            items,
          })),
          catchError((error: any) => of(new WeatherStationLoadDataForYearErrorAction({ error }))),
        ),
      ),
    );

  constructor(private actions$: Actions,
              private weatherStationsApiService: WeatherStationsApiService) {
  }
}
