import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { weatherStationRoutes } from '@rign/sh-weather-stations';

const routes: Routes = [
  {
    path: 'ws',
    outlet: 'ws',
    children: [...weatherStationRoutes],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
