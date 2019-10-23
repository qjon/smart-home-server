import {SwitchDeviceChangeSettingsDto, SwitchDeviceDto, SwitchDto, SwitchStatus} from '../interfaces/switch-device.interface';
import {Action} from '@ngrx/store';
import {RoomDto} from '../../rooms/interfaces/room-dto.interface';

export enum SwitchActionTypes {
  Create = '[Switches] Create',
  CreateError = '[Switches] Create error',
  CreateSuccess = '[Switches] Create success',
  ChangeSettings = '[Switches] Change Settings',
  ChangeSettingsError = '[Switches] Change Settings error',
  ChangeSettingsSuccess = '[Switches] Change Settings success',
  Load = '[Switches] Load',
  ChangeStatus = '[Switches] Change status',
  ChangeStatusError = '[Switches] Change status error',
  ChangeStatusSuccess = '[Switches] Change status success',
  ChangeConnectionStatus = '[Switches] Change connection status',
  OnOff = '[Switches] Turn on/off',
  OnOffSuccess = '[Switches] Turn on/off success',
  OpenCreateDialog = '[Switches] Open create dialog',
  SetRoom = '[Switches] Set Room',
  Update = '[Switches] Update device'
}

export class SwitchesCreateAction implements Action {
  readonly type = SwitchActionTypes.Create;

  constructor(public payload: { deviceId: string, apiKey: string, name: string }) {

  }
}

export class SwitchesCreateErrorAction implements Action {
  readonly type = SwitchActionTypes.CreateError;

  constructor(public payload: { error: any }) {
  }
}

export class SwitchesCreateSuccessAction implements Action {
  readonly type = SwitchActionTypes.CreateSuccess;
}

export class SwitchesChangeSettingsAction implements Action {
  readonly type = SwitchActionTypes.ChangeSettings;

  constructor(public payload: { deviceId: string, data: SwitchDeviceChangeSettingsDto }) {

  }
}

export class SwitchesChangeSettingsSuccessAction implements Action {
  readonly type = SwitchActionTypes.ChangeSettingsSuccess;

  constructor(public payload: { deviceId: string, data: SwitchDeviceChangeSettingsDto }) {

  }
}

export class SwitchesChangeSettingsErrorAction implements Action {
  readonly type = SwitchActionTypes.ChangeSettingsError;

  constructor(public payload: { error: any }) {

  }
}

export class SwitchesLoadAction implements Action {
  readonly type = SwitchActionTypes.Load;

  constructor(public payload: { devices: SwitchDeviceDto[] }) {

  }
}

export class SwitchesChangeStatusAction implements Action {
  readonly type = SwitchActionTypes.ChangeStatus;

  constructor(public payload: { deviceId: string, switch: SwitchDto }) {

  }
}

export class SwitchesChangeStatusErrorAction implements Action {
  readonly type = SwitchActionTypes.ChangeStatusError;
  public payload = {};
}

export class SwitchesChangeStatusSuccessAction implements Action {
  readonly type = SwitchActionTypes.ChangeStatusSuccess;

  constructor(public payload: { deviceId: string, switch: SwitchDto }) {

  }
}

export class SwitchesChangeConnectionStatusAction implements Action {
  readonly type = SwitchActionTypes.ChangeConnectionStatus;

  constructor(public payload: { deviceId: string, isConnected: boolean }) {

  }
}

export class SwitchesOnOffAction implements Action {
  readonly type = SwitchActionTypes.OnOff;

  constructor(public payload: { deviceId: string, status: SwitchStatus }) {

  }
}

export class SwitchesOpenCreateDialogAction implements Action {
  readonly type = SwitchActionTypes.OpenCreateDialog;
}

export class SwitchesOnOffSuccessAction implements Action {
  readonly type = SwitchActionTypes.OnOffSuccess;

  constructor(public payload: { deviceId: string, status: SwitchStatus }) {

  }
}

export class SwitchesUpdateAction implements Action {
  readonly type = SwitchActionTypes.Update;

  constructor(public payload: { deviceId: string, params: any }) {

  }
}

export class SwitchesSetRoomAction implements Action {
  readonly type = SwitchActionTypes.SetRoom;

  constructor(public payload: { deviceId: string, room: RoomDto }) {

  }
}

export type SwitchesAction =
  SwitchesCreateAction
  | SwitchesCreateErrorAction
  | SwitchesCreateSuccessAction
  | SwitchesChangeSettingsAction
  | SwitchesChangeSettingsErrorAction
  | SwitchesChangeSettingsSuccessAction
  | SwitchesLoadAction
  | SwitchesChangeStatusAction
  | SwitchesChangeStatusErrorAction
  | SwitchesChangeStatusSuccessAction
  | SwitchesChangeConnectionStatusAction
  | SwitchesOnOffAction
  | SwitchesOnOffSuccessAction
  | SwitchesOpenCreateDialogAction
  | SwitchesSetRoomAction
  | SwitchesUpdateAction
  ;
