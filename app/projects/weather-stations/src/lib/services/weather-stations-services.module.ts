import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CoreModule } from '@rign/sh-core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
  ],
  providers: [DatePipe]
})
export class WeatherStationsServicesModule { }
