import { Module } from '@nestjs/common';
import { DevicesService } from './devices/devices-service';
import { StorageModule } from '../storage/storage.module';
import { ApplicationService } from './application/application.service';
import { DeviceModelService } from './devices/device-model.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    StorageModule,
    DatabaseModule,
  ],
  providers: [
    ApplicationService,
    DevicesService,
    DeviceModelService,
  ],
})
export class WebsocketModule {
}
