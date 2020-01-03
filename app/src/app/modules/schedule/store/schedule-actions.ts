import { Action } from '@ngrx/store';

import { ScheduleDto } from '../interfaces/schedule-dto.interface';

export enum ScheduleActions {
  OpenAddModal = '[Schedule] Open ADD modal',
  Create = '[Schedule] Create schedule',
  CreateError = '[Schedule] Create schedule error',
  CreateSuccess = '[Schedule] Create schedule success',
}

export class ScheduleOpenAddModalAction implements Action {
  readonly type = ScheduleActions.OpenAddModal;

  constructor(public payload: { deviceId: string }) {
  }
}

export class ScheduleCreateAction implements Action {
  readonly type = ScheduleActions.Create;

  constructor(public payload: {scheduleData: Partial<ScheduleDto>}) {
  }
}

export class ScheduleCreateErrorAction implements Action {
  readonly type = ScheduleActions.CreateError;

  constructor(public payload: {error: any}) {
  }
}

export class ScheduleCreateSuccessAction implements Action {
  readonly type = ScheduleActions.CreateSuccess;

  constructor(public payload: {schedule: ScheduleDto}) {
  }
}
