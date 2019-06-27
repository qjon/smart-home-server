import { Module } from '@nestjs/common';
import { PingDeviceService } from './ping-device.service';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
  ],
  providers: [
    PingDeviceService,
  ],
})
export class WorkersModule {

  public constructor(protected pingDeviceService: PingDeviceService) {
    this.pingDeviceService.execute();
  }
}
