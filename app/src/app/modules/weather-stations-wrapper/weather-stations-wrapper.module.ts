import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherStationsModule } from '@rign/sh-weather-stations';
import { WeatherStationsApiModule } from './api/weather-stations-api.module';
import { WEATHER_STATIONS_API } from '../../../../projects/weather-stations/src/lib/interfaces/weather-stations-api';
import { WeatherStationsApiService } from './api/weather-stations-api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WeatherStationsModule,
    WeatherStationsApiModule,
  ],
  providers: [
    {provide: WEATHER_STATIONS_API, useClass: WeatherStationsApiService},
  ]
})
export class WeatherStationsWrapperModule { }
