import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HaWeatherStationsRoutingModule } from './ha-weather-stations-routing.module';
import { WEATHER_STATIONS_API, WeatherStationsModule } from '@rign/sh-weather-stations';
import { HaWeatherStationsApiModule } from './api/ha-weather-stations-api.module';
import { WeatherStationWrapperComponent } from './components/weather-station-wrapper/weather-station-wrapper.component';
import { RouterModule } from '@angular/router';
import { HaWeatherStationsApiService } from './api/ha-weather-stations-api.service';


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
    HaWeatherStationsApiModule,
    RouterModule,
    WeatherStationsModule
  ],
  providers: [
    {provide: WEATHER_STATIONS_API, useClass: HaWeatherStationsApiService},
  ]
})
export class HaWeatherStationsModule { }
