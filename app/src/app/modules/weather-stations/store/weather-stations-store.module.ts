import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { WeatherStationsEffectsService } from '@weather-stations/store/effects/weather-stations-effects.service';
import { WEATHER_STATION_STATE_NAME, weatherStationReducer } from '@weather-stations/store/weather-stations-reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([WeatherStationsEffectsService]),
    StoreModule.forFeature(WEATHER_STATION_STATE_NAME, weatherStationReducer),
  ]
})
export class WeatherStationsStoreModule { }
