import { Action } from '@ngrx/store';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

export enum WeatherStationsActionTypes {
  LoadStations = '[Weather Stations] Load station list',
  LoadStationsError = '[Weather Stations] Load station list error',
  LoadStationsSuccess = '[Weather Stations] Load station list success',
}


export class WeatherStationsLoadAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStations;
}

export class WeatherStationsLoadErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationsLoadSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsSuccess;

  constructor(public payload: { items: WeatherStationDto[] }) {
  }
}

export type WeatherStationsActions =
  WeatherStationsLoadAction
  | WeatherStationsLoadErrorAction
  | WeatherStationsLoadSuccessAction
  ;
