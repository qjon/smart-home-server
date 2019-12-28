import { Action } from '@ngrx/store';

export enum ScheduleActions {
  OpenAddModal = '[Schedule] Open ADD modal',
}

export class ScheduleOpenAddModalAction implements Action {
  readonly type = ScheduleActions.OpenAddModal;

  constructor(public payload: { deviceId: string }) {
  }
}
