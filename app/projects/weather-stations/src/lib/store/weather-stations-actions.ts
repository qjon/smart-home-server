import { Action } from '@ngrx/store';
import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { ChartType } from '../interfaces/weather-station-chart-type';

export enum WeatherStationsActionTypes {
  CompareAdd = '[Weather Stations] Add Weather Station to compare',
  CompareAddSuccess = '[Weather Stations] Add Weather Station to compare success',
  CompareEnd = '[Weather Stations] End compare',
  CompareRemove = '[Weather Stations] Remove Weather Station from compare',
  CompareStart = '[Weather Stations] Start compare',
  LoadStations = '[Weather Stations] Load station list',
  LoadStationsError = '[Weather Stations] Load station list error',
  LoadStationsSuccess = '[Weather Stations] Load station list success',
  LoadStationAggregatedData = '[Weather Stations] Load station aggregated data',
  LoadStationAggregatedDataError = '[Weather Stations] Load station aggregated data error',
  LoadStationAggregatedDataSuccess = '[Weather Stations] Load station aggregated data success',
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

export class WeatherStationLoadAggregateDataAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationAggregatedData;

  public readonly payload: { type: ChartType, weatherStationId: string, year: number, month?: number, day?: number };

  constructor(type: ChartType.Day | ChartType.Week, weatherStationId: string, year: number, month: number, day: number);
  constructor(type: ChartType.Month, weatherStationId: string, year: number, month: number);
  constructor(type: ChartType.Year, weatherStationId: string, year: number);
  constructor(type: ChartType, weatherStationId: string, year: number, month?: number, day?: number) {
    this.payload = {
      type,
      weatherStationId,
      year,
      month,
      day,
    };
  }
}

export class WeatherStationLoadAggregateDataErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationAggregatedDataError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadAggregateDataSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationAggregatedDataSuccess;

  public readonly payload: {
    type: ChartType,
    weatherStationId: string,
    year: number,
    month?: number,
    day?: number,
    items: WeatherStationDataDto[],
  };

  constructor(type: ChartType.Day | ChartType.Week, weatherStationId: string, items: WeatherStationDataDto[], year: number, month: number, day: number);
  constructor(type: ChartType.Month, weatherStationId: string, items: WeatherStationDataDto[], year: number, month: number);
  constructor(type: ChartType.Year, weatherStationId: string, items: WeatherStationDataDto[], year: number);
  constructor(type: ChartType, weatherStationId: string, items: WeatherStationDataDto[], year: number, month?: number, day?: number) {
    this.payload = {
      type,
      weatherStationId,
      items,
      year,
      month,
      day,
    };
  }
}

export class WeatherStationCompareAddAction implements Action {
  readonly type = WeatherStationsActionTypes.CompareAdd;

  constructor(public payload: { weatherStationId: string, type: ChartType, date: Date }) {
  }
}

export class WeatherStationCompareAddSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.CompareAddSuccess;

  constructor(public payload: { weatherStationId: string, data: WeatherStationDataDto[] }) {
  }
}

export class WeatherStationCompareEndAction implements Action {
  readonly type = WeatherStationsActionTypes.CompareEnd;
}

export class WeatherStationCompareRemoveAction implements Action {
  readonly type = WeatherStationsActionTypes.CompareRemove;

  constructor(public payload: { weatherStationId: string }) {
  }
}

export class WeatherStationCompareStartAction implements Action {
  readonly type = WeatherStationsActionTypes.CompareStart;

  constructor(public payload: { weatherStationId: string }) {
  }
}


export type WeatherStationsActions =
  WeatherStationCompareAddAction
  | WeatherStationCompareAddSuccessAction
  | WeatherStationCompareEndAction
  | WeatherStationCompareRemoveAction
  | WeatherStationCompareStartAction
  | WeatherStationsLoadAction
  | WeatherStationsLoadErrorAction
  | WeatherStationsLoadSuccessAction
  | WeatherStationLoadAggregateDataAction
  | WeatherStationLoadAggregateDataErrorAction
  | WeatherStationLoadAggregateDataSuccessAction
  ;
