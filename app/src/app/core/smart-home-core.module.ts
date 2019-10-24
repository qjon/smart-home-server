import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineEditComponent} from './components/inline-edit/inline-edit.component';
import {MatIconModule} from '@angular/material';

@NgModule({
  declarations: [
    InlineEditComponent,
  ],
  exports: [
    InlineEditComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SmartHomeCoreModule {
}
