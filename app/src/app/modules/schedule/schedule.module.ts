import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { EffectsModule } from '@ngrx/effects';

import { FormModule as CoreFormModule } from '@core/form/form.module';
import { OnSubmitErrorStateMatcher } from '@core/form/error/on-submit-error-state-matcher';
import { DialogModule } from '@core/dialog/dialog.module';

import { AddScheduleModalComponent } from './containers/add-schedule-modal/add-schedule-modal.component';
import { ScheduleApiModule } from './api/schedule-api.module';
import { ScheduleEffectService } from './store/effects/schedule-effect.service';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { ScheduleDetailsComponent } from './components/schedule-details/schedule-details.component';
import { StoreModule } from '@ngrx/store';
import { SWITCHES_STATE_NAME, switchesReducer } from '../switches/store/switches-reducer';
import { scheduleReducer, SCHEDULES_STATE } from './store/schedule-reducer';
import { ScheduleStateConnectorsModule } from './store/state-connectors/schedule-state-connectors.module';
import { ScheduleButtonComponent } from './containers/schedule-button/schedule-button.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    AddScheduleModalComponent,
    ScheduleListComponent,
    ScheduleDetailsComponent,
    ScheduleButtonComponent,
  ],
  entryComponents: [
    AddScheduleModalComponent,
  ],
  imports: [
    CoreFormModule,
    CommonModule,
    DialogModule,
    EffectsModule.forFeature([ScheduleEffectService]),
    MatBadgeModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatOptionModule,
    MatSelectModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ScheduleApiModule,
    ScheduleStateConnectorsModule,
    StoreModule.forFeature(SCHEDULES_STATE, scheduleReducer),
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnSubmitErrorStateMatcher },
  ],
  exports: [
    ScheduleListComponent,
    ScheduleButtonComponent,
  ],
})
export class ScheduleModule {
}
