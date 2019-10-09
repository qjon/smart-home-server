import { DiscoveredDevicePacketInterface } from '../../workers/discover/interfaces';

export interface ChangedStateDiscoveredDeviceInterface extends DiscoveredDevicePacketInterface {
  headers: { [key: string]: number };
}
