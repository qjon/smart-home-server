import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { NotificationsService } from '@core/notifications/notifications.service';

import {
  AttachDeviceToRoomAction,
  AttachDeviceToRoomErrorAction,
  AttachDeviceToRoomSuccessAction,
  DetachDeviceFromRoomAction,
  DetachDeviceFromRoomErrorAction,
  DetachDeviceFromRoomSuccessAction,
  RoomsAction,
  RoomsActionTypes,
} from '../rooms-actions';
import { RoomsApiService } from '../../api/rooms-api.service';
import { RoomsSelectors } from '../rooms-selectors';
import { RoomWithDevicesDto } from '../../interfaces/room-dto.interface';
import { SwitchesAction, SwitchesSetRoomAction } from '../../../switches/store/switches-actions';

@Injectable()
export class AttachDetachDeviceEffectsService {
  @Effect({
    dispatch: true,
  })
  public actionEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.Attach, RoomsActionTypes.Detach),
      switchMap((action: AttachDeviceToRoomAction | DetachDeviceFromRoomAction) => {
          const payload = action.payload;
          const isAttach = action.type === RoomsActionTypes.Attach;

          return this.roomsApiService.attachOrDetach(payload.roomId, payload.deviceId, isAttach ? 'attach' : 'detach')
            .pipe(
              switchMap(() => this.store
                .pipe(
                  select(RoomsSelectors.getRoom, { id: action.payload.roomId }),
                  take(1),
                ),
              ),
              mergeMap((room: RoomWithDevicesDto): (RoomsAction | SwitchesAction)[] => {
                if (isAttach) {
                  return [
                    new AttachDeviceToRoomSuccessAction({ ...payload }),
                    new SwitchesSetRoomAction({
                      deviceId: action.payload.deviceId,
                      room: { id: room.id, name: room.name },
                    }),
                  ];
                } else {
                  return [
                    new DetachDeviceFromRoomSuccessAction({ ...payload }),
                    new SwitchesSetRoomAction({ deviceId: action.payload.deviceId, room: null }),
                  ];
                }
              }),
              catchError((error) => of(isAttach ? new AttachDeviceToRoomErrorAction({ error }) : new DetachDeviceFromRoomErrorAction({ error }))),
            );
        },
      ),
    );

  @Effect({
    dispatch: false,
  })
  public actionAttachErrorEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.AttachError),
      tap(() => this.notificationsService.error('Attach device', 'Device has not been added to the room')),
    );

  @Effect({
    dispatch: false,
  })
  public actionAttachSuccessEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.AttachSuccess),
      tap(() => this.notificationsService.success('Attach device', 'Device has been added to the room')),
    );

  @Effect({
    dispatch: false,
  })
  public actionDetachErrorEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.DetachError),
      tap(() => this.notificationsService.error('Detach device', 'Device has not been removed from the room')),
    );

  @Effect({
    dispatch: false,
  })
  public actionDetachSuccessEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.DetachSuccess),
      tap(() => this.notificationsService.success('Detach device', 'Device has been removed from the room')),
    );

  constructor(private actions$: Actions,
              private store: Store<any>,
              private roomsApiService: RoomsApiService,
              private notificationsService: NotificationsService) {
  }
}
