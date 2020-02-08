import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { LastUpdateComponent } from './components/last-update/last-update.component';

@NgModule({
  declarations: [
    InlineEditComponent,
    LastUpdateComponent,
  ],
  exports: [
    InlineEditComponent,
    LastUpdateComponent,
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
