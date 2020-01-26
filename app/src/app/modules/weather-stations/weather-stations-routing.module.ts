import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherStationsListComponent } from '@weather-stations/containers/weather-stations-list/weather-stations-list.component';


const routes: Routes = [
  {
    path: '',
    component: WeatherStationsListComponent,
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
