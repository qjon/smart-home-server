import { DiscoveredDevicePacketInterface } from '../../workers/discover/interfaces';

export interface DiscoveredDeviceFilterInterface {
  filter(packet: DiscoveredDevicePacketInterface): boolean;

  getId(packet: DiscoveredDevicePacketInterface): string;
}
