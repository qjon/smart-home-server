import { Module } from '@nestjs/common';
import { DevicesController } from './devices/devices.controller';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    DevicesController,
  ],
  providers: [],
})
export class ApiModule {
}
