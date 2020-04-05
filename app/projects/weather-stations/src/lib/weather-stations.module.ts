import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { CoreModule } from '@rign/sh-core';

import { ChartModule } from 'angular-highcharts';

import { WeatherStationsRoutingModule } from './weather-stations-routing.module';
import { WeatherStationsListComponent } from './containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationItemComponent } from './components/weather-station-item/weather-station-item.component';
import { WeatherStationsStoreModule } from './store/weather-stations-store.module';
import { WeatherStationDetailsComponent } from './containers/weather-station-details/weather-station-details.component';
import { WeatherStationsServicesModule } from './services/weather-stations-services.module';


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
    CoreModule,
    WeatherStationsRoutingModule,
    WeatherStationsServicesModule,
    WeatherStationsStoreModule,
    MatButtonToggleModule,
    MatMenuModule,
    CoreModule,
  ],
})
export class WeatherStationsModule {
}
