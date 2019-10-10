import { Module } from '@nestjs/common';
import { PingDeviceService } from './ping-device.service';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { DevicesUpdateWorkerService } from './devices-update-worker.service';
import { SonOffEncryptionService } from './sonoff-encryption.service';
import { DeviceDiscoverService } from './device-discover.service';
import { DeviceStateChangeListenerWorkerService } from './device-state-change-listener-worker.service';
import { MdnsModule } from '../mdns/mdns.module';
import { DeviceStateChangeUpdateWorkerService } from './device-state-change-update-worker.service';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    MdnsModule,
  ],
  providers: [
    PingDeviceService,
    DevicesUpdateWorkerService,
    SonOffEncryptionService,
    DeviceDiscoverService,
    DeviceStateChangeListenerWorkerService,
    DeviceStateChangeUpdateWorkerService,
  ],
})
export class WorkersModule {

  public constructor(protected pingDeviceService: PingDeviceService,
                     private deviceDiscoverService: DevicesUpdateWorkerService,
                     private deviceStateChangeListenerWorkerService: DeviceStateChangeListenerWorkerService,
                     private deviceStateChangeUpdateWorkerService: DeviceStateChangeUpdateWorkerService) {
    // this.pingDeviceService.execute();
    this.deviceDiscoverService.execute();

    this.deviceStateChangeListenerWorkerService.execute();
    this.deviceStateChangeUpdateWorkerService.execute();
  }
}
