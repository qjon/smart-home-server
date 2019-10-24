import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {SwitchesStateConnectorsModule} from '../store/state-connectors/switches-state-connectors.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule,
    SwitchesStateConnectorsModule,
  ]
})
export class GuardsModule {
}
