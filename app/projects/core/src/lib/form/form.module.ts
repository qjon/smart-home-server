import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaysFieldComponent } from './fields/days-field/days-field.component';
import { MatButtonModule } from '@angular/material/button';
import { TimeFieldComponent } from './fields/time-field/time-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NumberFieldDirective } from './directives/number-field.directive';
import { LeadingZeroValueDirective } from './directives/leading-zero-value.directive';
import { RangeNumberValueDirective } from './directives/range-number-value.directive';
import { DaysPipe } from './pipes/days.pipe';
import { FormServicesModule } from './services/form-services.module';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
  declarations: [
    DaysFieldComponent,
    DaysPipe,
    LeadingZeroValueDirective,
    NumberFieldDirective,
    RangeNumberValueDirective,
    TimeFieldComponent,
    TimePipe,
  ],
  exports: [
    DaysFieldComponent,
    DaysPipe,
    TimeFieldComponent,
    TimePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormServicesModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class FormModule {
}
