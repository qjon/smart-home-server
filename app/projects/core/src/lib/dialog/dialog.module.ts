import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [FormDialogComponent],
  entryComponents: [FormDialogComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  exports: [
    FormDialogComponent,
  ],
})
export class DialogModule {
}
