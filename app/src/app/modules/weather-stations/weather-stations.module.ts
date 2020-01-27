import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import { WeatherStationsRoutingModule } from '@weather-stations/weather-stations-routing.module';
import { WeatherStationsListComponent } from '@weather-stations/containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationItemComponent } from '@weather-stations/components/weather-station-item/weather-station-item.component';
import { WeatherStationsApiModule } from '@weather-stations/api/weather-stations-api.module';
import { WeatherStationsStoreModule } from '@weather-stations/store/weather-stations-store.module';
import { SmartHomeCoreModule } from '@core/smart-home-core.module';


@NgModule({
  declarations: [
    WeatherStationsListComponent,
    WeatherStationItemComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    SmartHomeCoreModule,
    WeatherStationsApiModule,
    WeatherStationsRoutingModule,
    WeatherStationsStoreModule,
  ],
})
export class WeatherStationsModule {
}
