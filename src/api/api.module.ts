import { Module } from '@nestjs/common';
import { DevicesController } from './devices/devices.controller';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';
import { DevicesAdapterService } from './services/devices-adapter.service';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    DevicesController,
  ],
  providers: [DevicesAdapterService],
})
export class ApiModule {
}
