import { Injectable } from '@angular/core';

import { ChartType, WeatherStationConfigurationModel } from '@rign/sh-weather-stations';

@Injectable()
export class HaWeatherStationsConfigurationService implements WeatherStationConfigurationModel {
  public additionalPeriodOfTime: ChartType[] = [ChartType.Day, ChartType.Week, ChartType.Month, ChartType.Year];
  public allowCompare: boolean = true;
  public allowDetails: boolean = true;
  public apiHost: string = 'http://192.168.100.3:8080';
}
