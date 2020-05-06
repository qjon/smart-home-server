import { InjectionToken } from '@angular/core';

import { ChartType } from './weather-station-chart-type';

export interface WeatherStationConfigurationModel {
  allowDetails: boolean;
  allowCompare: boolean;
  additionalPeriodOfTime: ChartType[];
  apiHost: string;
}

export const WEATHER_STATION_CONFIGURATION: InjectionToken<WeatherStationConfigurationModel> = new InjectionToken<WeatherStationConfigurationModel>('WeatherStation configuration service');
