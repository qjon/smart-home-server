import { Action } from '@ngrx/store';
import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';

export enum WeatherStationsActionTypes {
  LoadStations = '[Weather Stations] Load station list',
  LoadStationsError = '[Weather Stations] Load station list error',
  LoadStationsSuccess = '[Weather Stations] Load station list success',
  LoadStationsAggregateDataForDay = '[Weather Stations] Load station aggregate data for day',
  LoadStationsAggregateDataForDayError = '[Weather Stations] Load station aggregate data for day error',
  LoadStationsAggregateDataForDaySuccess = '[Weather Stations] Load station aggregate data for day success',
  LoadStationsAggregateDataForWeek = '[Weather Stations] Load station aggregate data for week',
  LoadStationsAggregateDataForWeekError = '[Weather Stations] Load station aggregate data for week error',
  LoadStationsAggregateDataForWeekSuccess = '[Weather Stations] Load station aggregate data for week success',
  LoadStationsDataForMonth = '[Weather Stations] Load station data for month',
  LoadStationsDataForMonthError = '[Weather Stations] Load station data for month error',
  LoadStationsDataForMonthSuccess = '[Weather Stations] Load station data for month success',
  LoadStationsDataForYear = '[Weather Stations] Load station data for year',
  LoadStationsDataForYearError = '[Weather Stations] Load station data for year error',
  LoadStationsDataForYearSuccess = '[Weather Stations] Load station data for year success',
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

export class WeatherStationLoadAggregateDataForDayAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForDay;

  constructor(public payload: { weatherStationId: number, year: number, month: number, day: number }) {
  }
}

export class WeatherStationLoadAggregateDataForDayErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForDayError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadAggregateDataForDaySuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForDaySuccess;

  constructor(public payload: { weatherStationId: number, year: number, month: number, day: number, items: WeatherStationDataDto[] }) {
  }
}

export class WeatherStationLoadAggregateDataForWeekAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForWeek;

  constructor(public payload: { weatherStationId: number, year: number, month: number, day: number }) {
  }
}

export class WeatherStationLoadAggregateDataForWeekErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForWeekError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadAggregateDataForWeekSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsAggregateDataForWeekSuccess;

  constructor(public payload: { weatherStationId: number, year: number, month: number, day: number, items: WeatherStationDataDto[] }) {
  }
}

export class WeatherStationLoadDataForMonthAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForMonth;

  constructor(public payload: { weatherStationId: number, year: number, month: number }) {
  }
}

export class WeatherStationLoadDataForMonthErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForMonthError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadDataForMonthSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForMonthSuccess;

  constructor(public payload: { weatherStationId: number, year: number, month: number, items: WeatherStationDataDto[] }) {
  }
}

export class WeatherStationLoadDataForYearAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForYear;

  constructor(public payload: { weatherStationId: number, year: number }) {
  }
}

export class WeatherStationLoadDataForYearErrorAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForYearError;

  constructor(public payload: { error: any }) {
  }
}

export class WeatherStationLoadDataForYearSuccessAction implements Action {
  readonly type = WeatherStationsActionTypes.LoadStationsDataForYearSuccess;

  constructor(public payload: { weatherStationId: number, year: number, items: WeatherStationDataDto[] }) {
  }
}

export type WeatherStationsActions =
  WeatherStationsLoadAction
  | WeatherStationsLoadErrorAction
  | WeatherStationsLoadSuccessAction
  | WeatherStationLoadAggregateDataForDayAction
  | WeatherStationLoadAggregateDataForDayErrorAction
  | WeatherStationLoadAggregateDataForDaySuccessAction
  | WeatherStationLoadAggregateDataForWeekAction
  | WeatherStationLoadAggregateDataForWeekErrorAction
  | WeatherStationLoadAggregateDataForWeekSuccessAction
  | WeatherStationLoadDataForMonthAction
  | WeatherStationLoadDataForMonthErrorAction
  | WeatherStationLoadDataForMonthSuccessAction
  | WeatherStationLoadDataForYearAction
  | WeatherStationLoadDataForYearErrorAction
  | WeatherStationLoadDataForYearSuccessAction
  ;
