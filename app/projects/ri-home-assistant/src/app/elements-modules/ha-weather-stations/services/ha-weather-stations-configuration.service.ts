import { Injectable } from '@angular/core';

import { ChartType, WeatherStationConfigurationModel } from '@rign/sh-weather-stations';

@Injectable()
export class HaWeatherStationsConfigurationService implements WeatherStationConfigurationModel {
  public additionalPeriodOfTime: ChartType[] = [];
  public allowCompare: boolean = false;
  public allowDetails: boolean = true;
}
