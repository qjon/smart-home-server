import { Observable } from 'rxjs';
import { ChangedStateDeviceInterface } from './changed-state-device.interface';
import { ChangedStateDiscoveredDeviceInterface } from './changed-state-discovered-device.interface';

export interface ChangedStateDevicesServiceInterface {
  readonly devices$: Observable<ChangedStateDeviceInterface>;

  add(device: ChangedStateDiscoveredDeviceInterface): void;
}
