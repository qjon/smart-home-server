import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { DeviceRepositoryService } from '../database/repository/device-repository.service';
import { DevicesStorageService } from '../storage/devices-storage.service';
import { DeviceEntity } from '../database/entity/device.entity';
import { DeviceService } from '../database/services/device.service';
import { ApplicationsStorageService } from '../storage/applications-storage.service';

@Injectable()
export class PingDeviceService implements WorkerInterface {
  @Inject(ApplicationsStorageService)
  protected applications: ApplicationsStorageService;

  @Inject(DeviceRepositoryService)
  protected deviceRepositoryService: DeviceRepositoryService;

  @Inject(DeviceService)
  protected deviceService: DeviceService;

  @Inject(DevicesStorageService)
  protected deviceStorage: DevicesStorageService;

  protected logger = new Logger(PingDeviceService.name);

  protected interval: NodeJS.Timeout;

  public execute(): void {
    this.interval = setInterval((): void => {
      this.pingDevices();
    }, 5000);
  }

  public stop(): void {
    this.interval.unref();
  }

  async pingDevices(): Promise<DeviceEntity[]> {

    const devices = await this.deviceRepositoryService.getDevicesToPing(60 * 1000);

    devices.forEach((d) => {
      this.logger.verbose('Find unconnected device: ' + d.deviceId + ' from: ' + d.lastStatusChangeTimestamp);

      this.deviceService.markDeviceAsDisconnected(d.deviceId);

      const message = JSON.stringify({ action: 'app:isConnected', deviceId: d.deviceId, params: false });

      this.applications.sendMessageToAll(message);

      // todo: make ping to device
    });

    return devices;
  }

}
