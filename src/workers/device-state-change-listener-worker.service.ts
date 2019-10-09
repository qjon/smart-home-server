import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { DiscoveredDeviceFilterInterface } from '../mdns/interfaces/discovered-device-filter.interface';
import { EwelinkFilterService } from '../mdns/services/ewelink-filter.service';
import { ChangeStateDevicesService } from '../mdns/services/change-state-devices.service';
import { ChangedStateDiscoveredDeviceInterface } from '../mdns/interfaces/changed-state-discovered-device.interface';

const mDnsSd = require('node-dns-sd');

/**
 * This class listen on device state change and send that information to ChangedStateDevice stream
 */
@Injectable()
export class DeviceStateChangeListenerWorkerService implements WorkerInterface {

  @Inject(EwelinkFilterService)
  private discoveredDeviceFilter: DiscoveredDeviceFilterInterface;

  @Inject(ChangeStateDevicesService)
  private changeStateDevicesService: ChangeStateDevicesService;

  private logger = new Logger(this.constructor.name);

  public execute(): void {
    mDnsSd.ondata = (device: ChangedStateDiscoveredDeviceInterface) => {
      if (this.discoveredDeviceFilter.filter(device)) {
        this.logger.log('New update from eWelink device');
        this.changeStateDevicesService.add(device);
      }
    };

    mDnsSd.startMonitoring();
  }

  public stop(): void {
    mDnsSd.stopMonitoring();
  }
}
