import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherStationsRoutingModule } from '@weather-stations/weather-stations-routing.module';
import { WeatherStationsListComponent } from '@weather-stations/containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationItemComponent } from '@weather-stations/components/weather-station-item/weather-station-item.component';
import { WeatherStationsApiModule } from '@weather-stations/api/weather-stations-api.module';


@NgModule({
  declarations: [
    WeatherStationsListComponent,
    WeatherStationItemComponent,
  ],
  imports: [
    CommonModule,
    WeatherStationsApiModule,
    WeatherStationsRoutingModule,
  ],
})
export class WeatherStationsModule {
}
