import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'switches',
    loadChildren: './modules/switches/switches.module#SwitchesModule'
  },
  {
    path: 'weather-stations',
    loadChildren: './modules/weather-stations-wrapper/weather-stations-wrapper.module#WeatherStationsWrapperModule'
  },
  {
    path: '**',
    redirectTo: 'switches',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
