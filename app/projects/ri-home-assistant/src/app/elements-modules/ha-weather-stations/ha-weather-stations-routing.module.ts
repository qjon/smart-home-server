import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { weatherStationRoutes } from '@rign/sh-weather-stations';


const routes: Routes = [
  {
    path: 'ws',
    outlet: 'ws',
    children: [...weatherStationRoutes],
  },
  {
    path: '**',
    redirectTo: 'ws',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HaWeatherStationsRoutingModule { }
