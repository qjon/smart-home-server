import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomsApiModule} from '../api/rooms-api.module';
import {RoomsStateConnectorsModule} from '../store/state-connectors/rooms-state-connectors.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoomsApiModule,
    RoomsStateConnectorsModule,
  ]
})
export class RoomsGuardsModule {
}
