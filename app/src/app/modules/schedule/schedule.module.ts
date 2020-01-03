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

import { EffectsModule } from '@ngrx/effects';

import { FormModule as CoreFormModule } from '@core/form/form.module';
import { DialogModule } from '@core/dialog/dialog.module';

import { AddScheduleModalComponent } from './containers/add-schedule-modal/add-schedule-modal.component';
import { ScheduleApiModule } from './api/schedule-api.module';
import { ScheduleEffectService } from './store/effects/schedule-effect.service';
import { OnSubmitErrorStateMatcher } from '@core/form/error/on-submit-error-state-matcher';

@NgModule({
  declarations: [
    AddScheduleModalComponent,
  ],
  entryComponents: [
    AddScheduleModalComponent,
  ],
  imports: [
    CoreFormModule,
    CommonModule,
    DialogModule,
    EffectsModule.forFeature([ScheduleEffectService]),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ScheduleApiModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: OnSubmitErrorStateMatcher}
  ],
})
export class ScheduleModule {
}
