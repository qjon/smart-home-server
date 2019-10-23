import {RoomWithDevicesDto} from './room-dto.interface';
import {Observable} from 'rxjs';

export interface RoomsStateConnectorInterface {
  roomsFilter$: Observable<RoomWithDevicesDto[]>;
  rooms$: Observable<RoomWithDevicesDto[]>;

  attachDevice(deviceId: string, roomId: number): void;

  createRoom(name: string): void;

  detachDevice(deviceId: string, roomId: number): void;

  loadRooms(rooms: RoomWithDevicesDto[]): void;

  selectRoom(roomId: number): void;
}
