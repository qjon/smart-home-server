import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { LastUpdateComponent } from './components/last-update/last-update.component';
import { MainActionButtonSectionComponent } from './components/main-action-button-section/main-action-button-section.component';
import { MatButtonModule } from '@angular/material/button';
import { BottomActionButtonSectionComponent } from './components/bottom-action-button-section/bottom-action-button-section.component';

@NgModule({
  declarations: [
    BottomActionButtonSectionComponent,
    InlineEditComponent,
    LastUpdateComponent,
    MainActionButtonSectionComponent,
  ],
  exports: [
    BottomActionButtonSectionComponent,
    InlineEditComponent,
    LastUpdateComponent,
    MainActionButtonSectionComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class CoreModule {
}
