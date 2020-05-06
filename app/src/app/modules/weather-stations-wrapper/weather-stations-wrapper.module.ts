import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  weatherStationRoutes,
  WeatherStationsModule,
  WEATHER_STATION_CONFIGURATION,
  WEATHER_STATIONS_API,
} from '@rign/sh-weather-stations';

import { WeatherStationsApiModule } from './api/weather-stations-api.module';
import { WeatherStationsApiService } from './api/weather-stations-api.service';
import { WeatherStationsWrapperConfigurationService } from './services/weather-stations-wrapper-configuration.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([...weatherStationRoutes]),
    WeatherStationsModule,
    WeatherStationsApiModule,
  ],
  providers: [
    { provide: WEATHER_STATIONS_API, useClass: WeatherStationsApiService },
    { provide: WEATHER_STATION_CONFIGURATION, useClass: WeatherStationsWrapperConfigurationService },
  ],
})
export class WeatherStationsWrapperModule {
}
