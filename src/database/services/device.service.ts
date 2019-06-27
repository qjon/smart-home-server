import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceRepositoryService } from '../repository/device-repository.service';
import { LightSwitch, LightSwitchConfigure, LightSwitchStatus } from '../../interfaces/light/update-action.interface';
import { DeviceParamsEntity } from '../entity/device.params.entity';
import { DeviceConfigurationEntity } from '../entity/device.configuration.entity';
import { DeviceNotExistException } from '../../exceptions/device-not-exist.exception';
import { DeviceSwitchNotExistException } from '../../exceptions/device-switch-not-exist.exception';

export interface DeviceInfoInterface {
  deviceId: string;
  name: string;
}

@Injectable()
export class DeviceService {

  public constructor(private readonly entityManager: EntityManager,
                     private deviceRepository: DeviceRepositoryService) {

  }

  async create(deviceId: string, name: string, apikey: string, model: string): Promise<DeviceEntity> {
    let device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!!device) {
      device.apikey = apikey;
      device.lastPing = new Date();
      device.unsuccessfulPings = 0;
    } else {
      device = this.entityManager.create(DeviceEntity, { deviceId, name, apikey, model });
    }
    this.entityManager.save(device);

    return device;
  }

  async updateDevice(deviceId: string, params: LightSwitch[], configuration: LightSwitchConfigure[]): Promise<DeviceEntity> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    device.isConnected = true;

    if (params && params.length > 0) {
      this.updateDeviceParams(device, params);
    }

    if (configuration && configuration.length > 0) {
      this.updateDeviceConfiguration(device, configuration);
    }

    this.entityManager.save([device, ...device.params, ...device.configuration]);

    return device;
  }

  async updateDeviceName(deviceId: string, name: string): Promise<any> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    device.name = name;

    this.entityManager.save(device);
  }

  async updateDeviceOutletName(deviceId: string, outlet: number, name: string): Promise<any> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    const switchItem = device.params.find((s: DeviceParamsEntity) => s.outlet === outlet);

    if (!switchItem) {
      throw new DeviceSwitchNotExistException(deviceId, outlet);
    }

    switchItem.name = name;

    const logger = new Logger('Rename switch');

    logger.log(switchItem.toJSON());

    return this.entityManager.save(switchItem);
  }

  async getDevicesInfo(): Promise<{ [id: string]: DeviceInfoInterface }> {
    const devices = await this.deviceRepository.getAll();

    const response: { [id: string]: DeviceInfoInterface } = {};

    devices.forEach((d) => {
      const deviceId = d.deviceId;

      response[deviceId] = {
        deviceId,
        name: d.name,
      };
    });

    return response;
  }

  async disconnectAllDevices(): Promise<boolean> {
    const devices = await this.deviceRepository.getAll();

    devices.forEach((d) => {
      d.isConnected = false;
      d.unsuccessfulPings = 0;

      this.entityManager.save(d);
    });

    return true;
  }

  async markDeviceAsConnected(deviceId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    device.isConnected = true;
    device.lastPing = new Date();
    device.nextPing = new Date(Date.now() + 1800 * 1000);
    device.unsuccessfulPings = 0;

    this.entityManager.save(device);

    return device;
  }

  async markDeviceAsDisconnected(deviceId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    device.isConnected = false;

    this.entityManager.save(device);

    return device;
  }

  async incUnsuccessfulPing(deviceId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    device.unsuccessfulPings++;

    this.entityManager.save(device);

    return device;
  }

  private updateDeviceConfiguration(device: DeviceEntity, configParams: LightSwitchConfigure[]) {
    const currentConfiguration = device.configuration;

    configParams.forEach((s: LightSwitchConfigure) => {
      let configParam = currentConfiguration.find((p) => p.outlet === s.outlet);

      if (!!configParam) {
        configParam.status = s.startup === LightSwitchStatus.ON;
      } else {
        configParam = this.entityManager.create(DeviceConfigurationEntity, {
          device,
          outlet: s.outlet,
          status: s.startup === LightSwitchStatus.ON,
        });

        device.configuration.push(configParam);
      }
    });
  }

  private updateDeviceParams(device: DeviceEntity, params: LightSwitch[]) {
    const currentParams = device.params;

    params.forEach((s: LightSwitch) => {
      let param = currentParams.find((p) => p.outlet === s.outlet);

      if (!!param) {
        param.status = s.switch === LightSwitchStatus.ON;
        param.lastStatusChange = new Date();
      } else {
        param = this.entityManager.create(DeviceParamsEntity, {
          device,
          name: 'Switch ' + (s.outlet + 1).toString(),
          outlet: s.outlet,
          status: s.switch === LightSwitchStatus.ON,
        });

        device.params.push(param);
      }
    });
  }
}
