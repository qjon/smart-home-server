import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { DeviceRepositoryService } from '../database/repository/device-repository.service';
import { DeviceService } from '../database/services/device.service';
import { SonOffEncryptionService } from './sonoff-encryption.service';
import { DeviceDiscoverService } from './device-discover.service';

@Injectable()
export class DevicesUpdateWorkerService implements WorkerInterface {
  private logger = new Logger(this.constructor.name);

  @Inject(DeviceRepositoryService)
  private devicesRepository: DeviceRepositoryService;

  @Inject(DeviceService)
  private deviceService: DeviceService;

  @Inject(SonOffEncryptionService)
  private encryptionService: SonOffEncryptionService;

  @Inject(DeviceDiscoverService)
  private deviceDiscover: DeviceDiscoverService;

  async execute(): Promise<any> {
    const devices = await this.devicesRepository.getAll();
    const knownDevicesId = new Map();

    devices.forEach((d) => {
      knownDevicesId.set(d.deviceId, d.apikey);
    });

    this.deviceDiscover.devices$
      .subscribe((discoveredDevices) => {
        discoveredDevices.forEach((dd) => {
          if (dd.isNew) {
            this.deviceService.create(dd.id, dd.id, '', '');
            this.logger.log('New device: ' + dd.id + ' has been added');
          } else {
            this.deviceService.updateDevice(dd.id, dd.data.getSwitches(), dd.data.getConfiguration());
            this.deviceService.updateDeviceModel(dd.id, dd.data.type === 'single');
            this.logger.log('Status of device: ' + dd.id + ' has been updated');
          }
        });
      });

    await this.deviceDiscover.updateDevices();
  }

  public stop(): void {
  }
}
