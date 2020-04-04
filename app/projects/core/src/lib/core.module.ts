import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { LastUpdateComponent } from './components/last-update/last-update.component';
import { MainActionButtonSectionComponent } from './components/main-action-button-section/main-action-button-section.component';

@NgModule({
  declarations: [
    InlineEditComponent,
    LastUpdateComponent,
    MainActionButtonSectionComponent,
  ],
  exports: [
    InlineEditComponent,
    LastUpdateComponent,
    MainActionButtonSectionComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class CoreModule {
}
