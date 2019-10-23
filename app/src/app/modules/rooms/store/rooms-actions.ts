import {Action} from '@ngrx/store';
import {RoomWithDevicesDto} from '../interfaces/room-dto.interface';

export enum RoomsActionTypes {
  Attach = '[Rooms] Attach device to room',
  AttachError = '[Rooms] Attach device to room error',
  AttachSuccess = '[Rooms] Attach device to room success',
  Create = '[Rooms] Create room',
  CreateError = '[Rooms] Create room error',
  CreateSuccess = '[Rooms] Create room success',
  Detach = '[Rooms] Detach device to room',
  DetachError = '[Rooms] Detach device to room error',
  DetachSuccess = '[Rooms] Detach device to room success',
  Load = '[Rooms] Load rooms list',
  OpenCreateDialog = '[Rooms] Open create room dialog',
  SelectRoom = '[Rooms] SelectRoom',
}


export class AttachDeviceToRoomAction implements Action {
  readonly type = RoomsActionTypes.Attach;

  constructor(public payload: { deviceId: string, roomId: number }) {
  }
}

export class AttachDeviceToRoomErrorAction implements Action {
  readonly type = RoomsActionTypes.AttachError;

  constructor(public payload: { error: any }) {
  }
}

export class AttachDeviceToRoomSuccessAction implements Action {
  readonly type = RoomsActionTypes.AttachSuccess;

  constructor(public payload: { deviceId: string, roomId: number }) {
  }
}

export class CreateRoomAction implements Action {
  readonly type = RoomsActionTypes.Create;

  constructor(public payload: { name: string }) {
  }
}

export class CreateRoomErrorAction implements Action {
  readonly type = RoomsActionTypes.CreateError;

  constructor(public payload: { error: any }) {
  }
}

export class CreateRoomSuccessAction implements Action {
  readonly type = RoomsActionTypes.CreateSuccess;

  constructor(public payload: { room: RoomWithDevicesDto }) {
  }
}

export class DetachDeviceFromRoomAction implements Action {
  readonly type = RoomsActionTypes.Detach;

  constructor(public payload: { deviceId: string, roomId: number }) {
  }
}

export class DetachDeviceFromRoomErrorAction implements Action {
  readonly type = RoomsActionTypes.DetachError;

  constructor(public payload: { error: any }) {
  }
}

export class DetachDeviceFromRoomSuccessAction implements Action {
  readonly type = RoomsActionTypes.DetachSuccess;

  constructor(public payload: { deviceId: string, roomId: number }) {
  }
}

export class LoadRoomsAction implements Action {
  readonly type = RoomsActionTypes.Load;

  constructor(public payload: { rooms: RoomWithDevicesDto[] }) {
  }
}

export class RoomsOpenCreateDialogAction implements Action {
  readonly type = RoomsActionTypes.OpenCreateDialog;
}

export class SelectRoomAction implements Action {
  readonly type = RoomsActionTypes.SelectRoom;

  constructor(public payload: { roomId: number }) {

  }
}

export type RoomsAction =
  AttachDeviceToRoomAction
  | AttachDeviceToRoomErrorAction
  | AttachDeviceToRoomSuccessAction
  | CreateRoomAction
  | CreateRoomErrorAction
  | CreateRoomSuccessAction
  | DetachDeviceFromRoomAction
  | DetachDeviceFromRoomErrorAction
  | DetachDeviceFromRoomSuccessAction
  | LoadRoomsAction
  | RoomsOpenCreateDialogAction
  | SelectRoomAction
  ;
