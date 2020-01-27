import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  WeatherStationsActionTypes, WeatherStationsLoadErrorAction,
  WeatherStationsLoadSuccessAction,
} from '@weather-stations/store/weather-stations-actions';
import { WeatherStationsApiService } from '@weather-stations/api/weather-stations-api.service';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

@Injectable()
export class WeatherStationsEffectsService {

  @Effect({
    dispatch: true
  })
  public loadWeatherStations$ = this.actions$
    .pipe(
      ofType(WeatherStationsActionTypes.LoadStations),
      switchMap(() => this.weatherStationsApiService.getList()),
      map((items: WeatherStationDto[]) => new WeatherStationsLoadSuccessAction({items})),
      catchError((error: any) => of(new WeatherStationsLoadErrorAction({error})))
    );

  constructor(private actions$: Actions,
              private weatherStationsApiService: WeatherStationsApiService) { }
}
