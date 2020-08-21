import { HttpModule, Module } from '@nestjs/common';
import { PingDeviceService } from './ping-device.service';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { DevicesUpdateWorkerService } from './devices-update-worker.service';
import { SonOffEncryptionService } from './sonoff-encryption.service';
import { DeviceDiscoverService } from './device-discover.service';
import { DeviceStateChangeListenerWorkerService } from './device-state-change-listener-worker.service';
import { MdnsModule } from '../mdns/mdns.module';
import { DeviceStateChangeUpdateWorkerService } from './device-state-change-update-worker.service';
import { ScheduleWorkerService } from './schedule.service';
import { AdapterModule } from '../adapters/adapters.module';

@Module({
  imports: [
    AdapterModule,
    DatabaseModule,
    HttpModule,
    StorageModule,
    MdnsModule
  ],
  providers: [
    PingDeviceService,
    DevicesUpdateWorkerService,
    SonOffEncryptionService,
    DeviceDiscoverService,
    DeviceStateChangeListenerWorkerService,
    DeviceStateChangeUpdateWorkerService,
    ScheduleWorkerService,
  ],
})
export class WorkersModule {

  public constructor(protected pingDeviceService: PingDeviceService,
                     private deviceDiscoverService: DevicesUpdateWorkerService,
                     private deviceStateChangeListenerWorkerService: DeviceStateChangeListenerWorkerService,
                     private deviceStateChangeUpdateWorkerService: DeviceStateChangeUpdateWorkerService,
                     private scheduleWorkerService: ScheduleWorkerService) {
    // this.pingDeviceService.execute();
    this.deviceDiscoverService.execute();

    this.deviceStateChangeListenerWorkerService.execute();
    this.deviceStateChangeUpdateWorkerService.execute();
    this.scheduleWorkerService.execute();
  }
}
