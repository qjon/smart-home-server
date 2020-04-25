import { Routes } from '@angular/router';

import { WeatherStationsListComponent } from './containers/weather-stations-list/weather-stations-list.component';
import { WeatherStationDetailsComponent } from './containers/weather-station-details/weather-station-details.component';
import { WeatherStationsListResolverService } from './services/resolvers/weather-stations-list-resolver.service';
import { WeatherStationIdResolverService } from './services/resolvers/weather-station-id-resolver.service';
import { WeatherStationDetailsGuardService } from './services/guards/weather-station-details-guard.service';


export const weatherStationRoutes: Routes = [
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
        canActivate: [WeatherStationDetailsGuardService],
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
