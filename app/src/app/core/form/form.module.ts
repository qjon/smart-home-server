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

@NgModule({
  declarations: [DaysFieldComponent, TimeFieldComponent, NumberFieldDirective, LeadingZeroValueDirective, RangeNumberValueDirective],
  exports: [
    DaysFieldComponent,
    TimeFieldComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class FormModule { }
