import { Action } from '@ngrx/store';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

export enum WeatherStationsActionTypes {
  LoadStations = '[Weather Stations] Load station list',
  LoadStationsError = '[Weather Stations] Load station list error',
  LoadStationsSuccess = '[Weather Stations] Load station list success',
  LoadStationsData = '[Weather Stations] Load station data',
  LoadStationsDataError = '[Weather Stations] Load station data error',
  LoadStationsDataSuccess = '[Weather Stations] Load station data success',
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

export class WeatherStationLoadDataAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsData;

  constructor(public payload: { weatherStationId: number, from: number, to: number }) {
  }
}

export class WeatherStationLoadDataErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadDataSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataSuccess;

  constructor(public payload: { weatherStationId: number, from: number, to: number, items: WeatherStationDataDto[] }) {
  }
}

export type WeatherStationsActions =
  WeatherStationsLoadAction
  | WeatherStationsLoadErrorAction
  | WeatherStationsLoadSuccessAction
  | WeatherStationLoadDataAction
  | WeatherStationLoadDataErrorAction
  | WeatherStationLoadDataSuccessAction
  ;
