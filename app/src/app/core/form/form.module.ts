import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaysFieldComponent } from './days-field/days-field.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DaysFieldComponent],
  exports: [
    DaysFieldComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
})
export class FormModule { }
