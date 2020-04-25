import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { weatherStationRoutes, WeatherStationsModule } from '@rign/sh-weather-stations';
import { WEATHER_STATION_CONFIGURATION, WEATHER_STATIONS_API, WeatherStationsModule } from '@rign/sh-weather-stations';
import { WeatherStationsApiModule } from './api/weather-stations-api.module';
import { WeatherStationsApiService } from './api/weather-stations-api.service';
import { RouterModule } from '@angular/router';
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
