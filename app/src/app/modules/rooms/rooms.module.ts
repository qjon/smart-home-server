import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {ROOMS_STATE_NAME, roomsReducer} from './store/rooms-reducer';
import {MatDialogModule} from '@angular/material/dialog';
import {EffectsModule} from '@ngrx/effects';
import {CreateRoomEffectsService} from './store/effects/create-room-effects.service';
import {AddRoomComponent} from './components/add-room/add-room.component';
import {RoomsApiModule} from './api/rooms-api.module';
import {RoomsStateConnectorsModule} from './store/state-connectors/rooms-state-connectors.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RoomsGuardsModule} from './guards/rooms-guards.module';
import {SelectRoomComponent} from './components/select-room/select-room.component';
import {MatSelectModule} from '@angular/material/select';
import {AttachToRoomComponent} from './components/attach-to-room/attach-to-room.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {DetachFromRoomComponent} from './components/detach-from-room/detach-from-room.component';
import {AttachDetachDeviceEffectsService} from './store/effects/attach-detach-device-effects.service';

@NgModule({
  declarations: [
    AttachToRoomComponent,
    DetachFromRoomComponent,
    SelectRoomComponent,
  ],
  entryComponents: [
    AddRoomComponent,
  ],
  exports: [
    AttachToRoomComponent,
    DetachFromRoomComponent,
    SelectRoomComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      AttachDetachDeviceEffectsService,
      CreateRoomEffectsService,
    ]),
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RoomsApiModule,
    RoomsGuardsModule,
    RoomsStateConnectorsModule,
    StoreModule.forFeature(ROOMS_STATE_NAME, roomsReducer),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class RoomsModule {
}
