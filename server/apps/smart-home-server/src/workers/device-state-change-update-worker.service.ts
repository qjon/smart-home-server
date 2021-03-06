import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { ChangedStateDevicesServiceInterface } from '../mdns/interfaces/changed-state-devices-service.interface';
import { ChangeStateDevicesService } from '../mdns/services/change-state-devices.service';
import { ChangedStateDeviceInterface } from '../mdns/interfaces/changed-state-device.interface';
import { catchError, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { DeviceRepositoryService } from '../database/repository/device-repository.service';
import { defer, of } from 'rxjs';
import { DeviceService } from '../database/services/device.service';
import { ApplicationsStorageService } from '../storage/applications-storage.service';

@Injectable()
export class DeviceStateChangeUpdateWorkerService implements WorkerInterface {
  @Inject(ApplicationsStorageService)
  protected applications: ApplicationsStorageService;

  @Inject(ChangeStateDevicesService)
  private changeStateDevicesService: ChangedStateDevicesServiceInterface;

  @Inject(DeviceRepositoryService)
  private deviceRepositoryService: DeviceRepositoryService;

  @Inject(DeviceService)
  private deviceService: DeviceService;

  private logger = new Logger(this.constructor.name);

  public execute(): void {
    this.changeStateDevicesService.devices$
      .pipe(
        distinctUntilChanged((prev: ChangedStateDeviceInterface, curr: ChangedStateDeviceInterface) => {
          return prev.id === curr.id && prev.seq === curr.seq;
        }),
        switchMap((changedDevice) => defer(async () => {
            const device = await this.deviceRepositoryService.getByDeviceId(changedDevice.id);

            return device.apikey;
          })
            .pipe(
              take(1),
              map((apiKey) => {
                return {
                  changedDevice,
                  apiKey,
                };
              }),
              catchError((e) => {
                this.logger.error('Not found device by ID: ' + changedDevice.id);

                return of({
                  changedDevice,
                  apiKey: null,
                });
              }),
            ),
        ),
        filter((data: { changedDevice: ChangedStateDeviceInterface, apiKey: string }) => !!data.apiKey),
      )
      .subscribe((data: { changedDevice: ChangedStateDeviceInterface, apiKey: string }) => {
        this.logger.log('Start updating device: ' + data.changedDevice.id);
        const changedData = data.changedDevice.getData(data.apiKey);

        this.deviceService.markDeviceAsConnected(data.changedDevice.id)
          .then(() => this.deviceService.updateDevice(data.changedDevice.id, changedData.getSwitches(), changedData.getConfiguration()))
          .then((device) => {
            const message = JSON.stringify({
              action: 'app:update',
              deviceId: device.deviceId,
              params: device.params.map(p => p.toJSON()),
            });
            this.applications.sendMessageToAll(message);

            const messageIsConnected = JSON.stringify({
              action: 'app:isConnected',
              deviceId: device.deviceId,
              params: true,
            });

            this.applications.sendMessageToAll(messageIsConnected);

            this.logger.log('Device: ' + device.id + ' has been updated to: ' + JSON.stringify(device.params));
          });
      });
  }

  public stop(): void {
  }

}
