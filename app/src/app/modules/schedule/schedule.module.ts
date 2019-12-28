import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddScheduleModalComponent } from './containers/add-schedule-modal/add-schedule-modal.component';
import { EffectsModule } from '@ngrx/effects';
import { ScheduleDialogEffectService } from './store/effects/schedule-dialog-effect.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { DialogModule } from '../../core/dialog/dialog.module';

@NgModule({
  declarations: [
    AddScheduleModalComponent,
  ],
  entryComponents: [
    AddScheduleModalComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    EffectsModule.forFeature([ScheduleDialogEffectService]),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA
  // ]
})
export class ScheduleModule { }
