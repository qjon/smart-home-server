import { Injectable } from '@nestjs/common';
import { ChangedStateDevicesServiceInterface } from '../interfaces/changed-state-devices-service.interface';
import { Observable, Subject } from 'rxjs';
import { ChangedStateDeviceInterface } from '../interfaces/changed-state-device.interface';
import { ChangedStateDiscoveredDeviceInterface } from '../interfaces/changed-state-discovered-device.interface';
import { ChangedStateDeviceClass } from '../models/changed-state-device.class';

@Injectable()
export class ChangeStateDevicesService implements ChangedStateDevicesServiceInterface {
  private devices = new Subject<ChangedStateDeviceInterface>();

  readonly devices$: Observable<ChangedStateDeviceInterface> = this.devices.asObservable();

  public add(device: ChangedStateDiscoveredDeviceInterface): void {
    this.devices.next(new ChangedStateDeviceClass(device));
  }
}
