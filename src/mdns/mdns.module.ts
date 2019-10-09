import { Module } from '@nestjs/common';
import { EwelinkFilterService } from './services/ewelink-filter.service';
import { ChangeStateDevicesService } from './services/change-state-devices.service';

@Module({
  imports: [],
  providers: [EwelinkFilterService, ChangeStateDevicesService],
  exports: [
    EwelinkFilterService,
    ChangeStateDevicesService,
  ],
})
export class MdnsModule {
}
