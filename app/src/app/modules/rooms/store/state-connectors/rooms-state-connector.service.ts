import {Injectable} from '@angular/core';
import {RoomsStateConnectorsModule} from './rooms-state-connectors.module';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';
import {select, Store} from '@ngrx/store';
import {AttachDeviceToRoomAction, CreateRoomAction, DetachDeviceFromRoomAction, LoadRoomsAction, SelectRoomAction} from '../rooms-actions';
import {Observable} from 'rxjs';
import {RoomWithDevicesDto} from '../../interfaces/room-dto.interface';
import {RoomsSelectors} from '../rooms-selectors';
import {switchesSelectors} from '../../../switches/store/switches-selectors';
import {map, withLatestFrom} from 'rxjs/operators';

@Injectable({
  providedIn: RoomsStateConnectorsModule
})
export class RoomsStateConnectorService implements RoomsStateConnectorInterface {

  public rooms$: Observable<RoomWithDevicesDto[]> = this.store
    .pipe(
      select(RoomsSelectors.list),
    );

  public roomsFilter$: Observable<RoomWithDevicesDto[]> =
    this.rooms$
      .pipe(
        withLatestFrom(
          this.store
            .pipe(
              select(switchesSelectors.allIds)
            )
        ),
        map(([rooms, devicesId]: [RoomWithDevicesDto[], string[]]) => {
          return [{
            id: null,
            name: 'All',
            devices: devicesId,
          }, ...rooms];
        })
      );

  constructor(private store: Store<any>) {
  }

  public attachDevice(deviceId: string, roomId: number): void {
    this.store.dispatch(new AttachDeviceToRoomAction({deviceId, roomId}));
  }

  public createRoom(name: string): void {
    this.store.dispatch(new CreateRoomAction({name}));
  }

  public detachDevice(deviceId: string, roomId: number): void {
    this.store.dispatch(new DetachDeviceFromRoomAction({deviceId, roomId}));
  }

  public loadRooms(rooms: RoomWithDevicesDto[]): void {
    this.store.dispatch(new LoadRoomsAction({rooms}));
  }

  public selectRoom(roomId: number): void {
    this.store.dispatch(new SelectRoomAction({roomId}));
  }
}
