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

import { WeatherStationsListComponent } from './containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationItemComponent } from './components/weather-station-item/weather-station-item.component';
import { WeatherStationsStoreModule } from './store/weather-stations-store.module';
import { WeatherStationDetailsComponent } from './containers/weather-station-details/weather-station-details.component';
import { WeatherStationsServicesModule } from './services/weather-stations-services.module';
import { WeatherStationChartComponent } from './components/weather-station-chart/weather-station-chart.component';
import { WeatherStationDetailsChartComponent } from './components/weather-station-details-chart/weather-station-details-chart.component';
import { WeatherStationCompareButtonsComponent } from './components/weather-station-compare-buttons/weather-station-compare-buttons.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    WeatherStationsListComponent,
    WeatherStationItemComponent,
    WeatherStationDetailsComponent,
    WeatherStationChartComponent,
    WeatherStationDetailsChartComponent,
    WeatherStationCompareButtonsComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    CoreModule,
    WeatherStationsServicesModule,
    WeatherStationsStoreModule,
    MatButtonToggleModule,
    MatMenuModule,
    RouterModule,
    CoreModule,
  ],
})
export class WeatherStationsModule {
}
