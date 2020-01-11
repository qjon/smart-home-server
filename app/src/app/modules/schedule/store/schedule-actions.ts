import { Action } from '@ngrx/store';

import { ScheduleDto } from '../interfaces/schedule-dto.interface';

export enum ScheduleActions {
  OpenAddModal = '[Schedule] Open ADD modal',
  Create = '[Schedule] Create schedule',
  CreateError = '[Schedule] Create schedule error',
  CreateSuccess = '[Schedule] Create schedule success',
  ChangeActiveStatus = '[Schedule] Change schedule active status',
  ChangeActiveStatusError = '[Schedule] Change schedule active status error',
  ChangeActiveStatusSuccess = '[Schedule] Change schedule active status success',
  Load = '[Schedule] Load schedule',
  LoadError = '[Schedule] Load schedule error',
  LoadSuccess = '[Schedule] Load schedule success',
  Remove = '[Schedule] Remove schedule',
  RemoveError = '[Schedule] Remove schedule error',
  RemoveSuccess = '[Schedule] Remove schedule success',
}

export class ScheduleOpenAddModalAction implements Action {
  readonly type = ScheduleActions.OpenAddModal;

  constructor(public payload: { deviceId: string }) {
  }
}

export class ScheduleCreateAction implements Action {
  readonly type = ScheduleActions.Create;

  constructor(public payload: { scheduleData: Partial<ScheduleDto> }) {
  }
}

export class ScheduleCreateErrorAction implements Action {
  readonly type = ScheduleActions.CreateError;

  constructor(public payload: { error: any }) {
  }
}

export class ScheduleCreateSuccessAction implements Action {
  readonly type = ScheduleActions.CreateSuccess;

  constructor(public payload: { deviceId: string, schedule: ScheduleDto }) {
  }
}

export class ScheduleLoadAction implements Action {
  readonly type = ScheduleActions.Load;

  constructor(public payload: { deviceId: string }) {
  }
}

export class ScheduleLoadErrorAction implements Action {
  readonly type = ScheduleActions.LoadError;

  constructor(public payload: { deviceId: string, error: any }) {
  }
}

export class ScheduleLoadSuccessAction implements Action {
  readonly type = ScheduleActions.LoadSuccess;

  constructor(public payload: { deviceId: string, scheduleList: ScheduleDto[] }) {
  }
}

export class ScheduleChangeActiveStatusAction implements Action {
  readonly type = ScheduleActions.ChangeActiveStatus;

  constructor(public payload: { deviceId: string, scheduleId: number, isActive: boolean }) {
  }
}

export class ScheduleChangeActiveStatusErrorAction implements Action {
  readonly type = ScheduleActions.ChangeActiveStatusError;

  constructor(public payload: { deviceId: string, scheduleId: number, error: any }) {
  }
}

export class ScheduleChangeActiveStatusSuccessAction implements Action {
  readonly type = ScheduleActions.ChangeActiveStatusSuccess;

  constructor(public payload: { deviceId: string, scheduleId: number, isActive: boolean }) {
  }
}

export class ScheduleRemoveAction implements Action {
  readonly type = ScheduleActions.Remove;

  constructor(public payload: { deviceId: string, scheduleId: number }) {
  }
}

export class ScheduleRemoveErrorAction implements Action {
  readonly type = ScheduleActions.RemoveError;

  constructor(public payload: { deviceId: string, scheduleId: number, error: any }) {
  }
}

export class ScheduleRemoveSuccessAction implements Action {
  readonly type = ScheduleActions.RemoveSuccess;

  constructor(public payload: { deviceId: string, scheduleId: number }) {
  }
}

export type ScheduleAction =
  ScheduleOpenAddModalAction
  | ScheduleCreateAction
  | ScheduleCreateErrorAction
  | ScheduleCreateSuccessAction
  | ScheduleLoadAction
  | ScheduleLoadErrorAction
  | ScheduleLoadSuccessAction
  | ScheduleChangeActiveStatusAction
  | ScheduleChangeActiveStatusErrorAction
  | ScheduleChangeActiveStatusSuccessAction
  | ScheduleRemoveAction
  | ScheduleRemoveErrorAction
  | ScheduleRemoveSuccessAction
  ;
