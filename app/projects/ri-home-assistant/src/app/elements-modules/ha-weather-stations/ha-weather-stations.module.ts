import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WEATHER_STATION_CONFIGURATION, WEATHER_STATIONS_API, WeatherStationsModule } from '@rign/sh-weather-stations';

import { WeatherStationWrapperComponent } from './components/weather-station-wrapper/weather-station-wrapper.component';
import { HaWeatherStationsApiService } from './services/ha-weather-stations-api.service';
import { HaWeatherStationsServicesModule } from './services/ha-weather-stations-services.module';
import { HaWeatherStationsConfigurationService } from './services/ha-weather-stations-configuration.service';


@NgModule({
  declarations: [
    WeatherStationWrapperComponent,
  ],
  entryComponents: [
    WeatherStationWrapperComponent,
  ],
  exports: [
    WeatherStationWrapperComponent,
  ],
  imports: [
    CommonModule,
    HaWeatherStationsServicesModule,
    RouterModule,
    WeatherStationsModule
  ],
  providers: [
    {provide: WEATHER_STATIONS_API, useClass: HaWeatherStationsApiService},
    {provide: WEATHER_STATION_CONFIGURATION, useClass: HaWeatherStationsConfigurationService},
  ]
})
export class HaWeatherStationsModule { }
