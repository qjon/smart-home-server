import { Injectable } from '@angular/core';

import { ChartType, WeatherStationConfigurationModel } from '@rign/sh-weather-stations';

@Injectable()
export class WeatherStationsWrapperConfigurationService implements WeatherStationConfigurationModel {
  public additionalPeriodOfTime: ChartType[] = [ChartType.Week, ChartType.Month, ChartType.Year];
  public allowCompare: boolean = true;
  public allowDetails: boolean = true;
}
