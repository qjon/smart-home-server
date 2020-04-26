import { ChartType } from './weather-station-chart-type';
import { InjectionToken } from '@angular/core';

export interface WeatherStationConfigurationModel {
  allowDetails: boolean;
  allowCompare: boolean;
  additionalPeriodOfTime: ChartType[];
}

export const WEATHER_STATION_CONFIGURATION: InjectionToken<WeatherStationConfigurationModel> = new InjectionToken<WeatherStationConfigurationModel>('WeatherStation configuration service');
