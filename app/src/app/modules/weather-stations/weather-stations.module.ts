import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ChartModule } from 'angular-highcharts';
import { SmartHomeCoreModule } from '@core/smart-home-core.module';
import { WeatherStationsRoutingModule } from '@weather-stations/weather-stations-routing.module';
import { WeatherStationsListComponent } from '@weather-stations/containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationItemComponent } from '@weather-stations/components/weather-station-item/weather-station-item.component';
import { WeatherStationsApiModule } from '@weather-stations/api/weather-stations-api.module';
import { WeatherStationsStoreModule } from '@weather-stations/store/weather-stations-store.module';
import { WeatherStationDetailsComponent } from '@weather-stations/containers/weather-station-details/weather-station-details.component';
import { WeatherStationsServicesModule } from '@weather-stations/services/weather-stations-services.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    WeatherStationsListComponent,
    WeatherStationItemComponent,
    WeatherStationDetailsComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    SmartHomeCoreModule,
    WeatherStationsApiModule,
    WeatherStationsRoutingModule,
    WeatherStationsServicesModule,
    WeatherStationsStoreModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
})
export class WeatherStationsModule {
}
