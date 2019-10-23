import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'switches',
    loadChildren: './modules/switches/switches.module#SwitchesModule'
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
