import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { DeviceRepositoryService } from '../database/repository/device-repository.service';
import { DiscoveredDeviceInterface } from './discover/interfaces';
import { DiscoveredDevice } from './discover/discovered-device.class';

const mDnsSd = require('node-dns-sd');

@Injectable()
export class DeviceDiscoverService {
  private devices = new Subject<DiscoveredDevice[]>();

  public devices$: Observable<DiscoveredDevice[]> = this.devices.asObservable();

  private logger = new Logger(this.constructor.name);

  @Inject(DeviceRepositoryService)
  private devicesRepository: DeviceRepositoryService;

  async updateDevices(): Promise<any> {
    this.logger.log('Start looking for new devices');

    this.getIdAndApiKeysForKnownDevices()
      .then((knownDevices) => mDnsSd.discover({
          name: '_ewelink._tcp.local',
        })
          .then((deviceList: DiscoveredDeviceInterface[]) => {
            this.logger.log('Found ' + deviceList.length + ' devices');
            this.devices.next(deviceList.map((d) => new DiscoveredDevice(d, knownDevices)));
          }),
      )
      .catch((error) => {
        this.logger.error(error);
      });
  }

  private async getIdAndApiKeysForKnownDevices(): Promise<Map<string, string>> {
    const devices = await this.devicesRepository.getAll();

    const knownDevicesId = new Map<string, string>();

    devices.forEach((d) => {
      knownDevicesId.set(d.deviceId, d.apikey);
    });

    return knownDevicesId;
  }
}
