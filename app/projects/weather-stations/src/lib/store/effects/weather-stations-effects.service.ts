import { Inject, Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import {
  WeatherStationCompareAddAction, WeatherStationCompareAddSuccessAction,
  WeatherStationLoadAggregateDataAction, WeatherStationLoadAggregateDataErrorAction,
  WeatherStationLoadAggregateDataSuccessAction,
  WeatherStationsActionTypes,
  WeatherStationsLoadErrorAction,
  WeatherStationsLoadSuccessAction,
} from '../weather-stations-actions';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../../interfaces/weather-station-data-dto';
import { WEATHER_STATIONS_API, WeatherStationsApi } from '../../interfaces/weather-stations-api';
import { ChartType } from '../../interfaces/weather-station-chart-type';

@Injectable()
export class WeatherStationsEffectsService {

  @Effect({
    dispatch: true,
  })
  public addDataToCompare$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.CompareAdd),
      mergeMap((action: WeatherStationCompareAddAction) => this.weatherStationsApiService.getAggregateData(
        action.payload.type,
        action.payload.weatherStationId,
        action.payload.date.getFullYear(),
        action.payload.date.getMonth(),
        action.payload.date.getDate())
        .pipe(
          map((items: WeatherStationDataDto[]) => {
            return new WeatherStationCompareAddSuccessAction({
              weatherStationId: action.payload.weatherStationId,
              data: items,
            });
          }),
        )
      ),
    );


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
  public loadWeatherStationsAggregatedData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationAggregatedData),
      switchMap((action: WeatherStationLoadAggregateDataAction) => this.weatherStationsApiService.getAggregateData(action.payload.type, action.payload.weatherStationId, action.payload.year, action.payload.month, action.payload.day)
        .pipe(
          map((items: WeatherStationDataDto[]) => {
            switch (action.payload.type) {
              case ChartType.Year:
                return new WeatherStationLoadAggregateDataSuccessAction(
                  action.payload.type,
                  action.payload.weatherStationId,
                  items,
                  action.payload.year,
                );
              case ChartType.Month:
                return new WeatherStationLoadAggregateDataSuccessAction(
                  action.payload.type,
                  action.payload.weatherStationId,
                  items,
                  action.payload.year,
                  action.payload.month,
                );
              case ChartType.Week:
              case ChartType.Day:
                return new WeatherStationLoadAggregateDataSuccessAction(
                  action.payload.type,
                  action.payload.weatherStationId,
                  items,
                  action.payload.year,
                  action.payload.month,
                  action.payload.day,
                );
            }
          }),
          catchError((error: any) => of(new WeatherStationLoadAggregateDataErrorAction({ error }))),
        ),
      ),
    );

  constructor(private actions$: Actions,
              @Inject(WEATHER_STATIONS_API) private weatherStationsApiService: WeatherStationsApi) {
  }
}
