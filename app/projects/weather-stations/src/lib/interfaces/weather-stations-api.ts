import { Observable } from 'rxjs';

import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { InjectionToken } from '@angular/core';

export interface WeatherStationsApi {
  getList(): Observable<WeatherStationDto[]>;

  getAggregateDataForWeek(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;

  getAggregateDataForDay(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;

  getAggregateDataForMonth(id: number, year: number, month: number): Observable<WeatherStationDataDto[]>;

  getAggregateDataForYear(id: number, year: number): Observable<WeatherStationDataDto[]>;
}

export const WEATHER_STATIONS_API = new InjectionToken<WeatherStationsApi>('[Weather Stations] - API service');
