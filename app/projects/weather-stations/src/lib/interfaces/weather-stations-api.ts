import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { ChartType } from './weather-station-chart-type';

export interface WeatherStationsApi {
  getList(): Observable<WeatherStationDto[]>;

  getAggregateData(type: ChartType, id: number, year: number, month?: number, day?: number): Observable<WeatherStationDataDto[]>;
}

export const WEATHER_STATIONS_API = new InjectionToken<WeatherStationsApi>('[Weather Stations] - API service');
