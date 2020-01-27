import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  WeatherStationLoadDataAction, WeatherStationLoadDataSuccessAction,
  WeatherStationsActionTypes, WeatherStationsLoadErrorAction,
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
  public loadWeatherStationsData$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStationsData),
      switchMap((action: WeatherStationLoadDataAction) => this.weatherStationsApiService.getData(action.payload.weatherStationId, action.payload.from, action.payload.to)
        .pipe(
          map((items: WeatherStationDataDto[]) => new WeatherStationLoadDataSuccessAction({
            weatherStationId: action.payload.weatherStationId,
            from: action.payload.from,
            to: action.payload.to,
            items,
          })),
          catchError((error: any) => of(new WeatherStationsLoadErrorAction({ error }))),
        ),
      ),
    );

  constructor(private actions$: Actions,
              private weatherStationsApiService: WeatherStationsApiService) {
  }
}
