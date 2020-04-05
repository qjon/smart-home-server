import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherStationsListComponent } from './containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationDetailsComponent } from './containers/weather-station-details/weather-station-details.component';
import { WeatherStationsListResolverService } from './services/resolvers/weather-stations-list-resolver.service';
import { WeatherStationIdResolverService } from './services/resolvers/weather-station-id-resolver.service';


const routes: Routes = [
  {
    path: '',
    resolve: [WeatherStationsListResolverService],
    children: [
      {
        path: '',
        component: WeatherStationsListComponent,
      },
      {
        path: ':weatherStationId',
        component: WeatherStationDetailsComponent,
        resolve: {
          weatherStationId: WeatherStationIdResolverService,
        },
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherStationsRoutingModule {
}
