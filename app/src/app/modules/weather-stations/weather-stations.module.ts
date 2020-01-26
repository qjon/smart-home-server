import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherStationsRoutingModule } from './weather-stations-routing.module';
import { WeatherStationsListComponent } from './containers/weather-stations-list/weather-stations-list.component';


@NgModule({
  declarations: [WeatherStationsListComponent],
  imports: [
    CommonModule,
    WeatherStationsRoutingModule
  ]
})
export class WeatherStationsModule { }
