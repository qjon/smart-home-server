import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';
import { DevicesAdapterService } from '../adapters/devices-adapter.service';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
  ],
  exports: [
    DevicesAdapterService,
  ],
  providers: [DevicesAdapterService],
})
export class AdapterModule {
}
