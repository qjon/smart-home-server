import { ScheduleDto } from '../interfaces/schedule-dto.interface';
import { ScheduleAction, ScheduleActions } from './schedule-actions';

export interface DeviceSchedules {
  scheduleList: { [key: string]: ScheduleDto };
  ids: number[];
}

export interface ScheduleState {
  [deviceId: string]: DeviceSchedules;
}


export const emptyScheduleState: ScheduleState = {};

export const SCHEDULES_STATE = 'schedules';


export function scheduleReducer(state: ScheduleState = emptyScheduleState, action: ScheduleAction): ScheduleState {
  let scheduleList: { [key: string]: ScheduleDto } = {};

  let ids: number[] = [];

  let deviceId: string;

  switch (action.type) {
    case ScheduleActions.LoadSuccess:
      action.payload.scheduleList.forEach((schedule: ScheduleDto) => {
        const id = schedule.id;

        scheduleList[id] = schedule;
        ids.push(id);
      });

      return {
        ...state,
        [action.payload.deviceId]: {
          scheduleList,
          ids,
        },
      };
    case ScheduleActions.ChangeActiveStatusSuccess:
      deviceId = action.payload.deviceId;

      return {
        ...state,
        [deviceId]: {
          ...state[deviceId],
          scheduleList: {
            ...state[deviceId].scheduleList,
            [action.payload.scheduleId]: {
              ...state[deviceId].scheduleList[action.payload.scheduleId],
              isActive: action.payload.isActive,
            },
          },
        },
      };
    case ScheduleActions.CreateSuccess:
      deviceId = action.payload.deviceId;

      return {
        ...state,
        [deviceId]: {
          ...state[deviceId],
          scheduleList: {
            ...state[deviceId].scheduleList,
            [action.payload.schedule.id]: action.payload.schedule,
          },
          ids: [...state[deviceId].ids, action.payload.schedule.id],
        },
      };
    case ScheduleActions.RemoveSuccess:
      deviceId = action.payload.deviceId;

      scheduleList = { ...state[deviceId].scheduleList };
      delete scheduleList[action.payload.scheduleId];

      ids = state[deviceId].ids.filter((id) => id !== action.payload.scheduleId);

      return {
        ...state,
        [deviceId]: {
          ...state[deviceId],
          scheduleList,
          ids,
        },
      };
    default:
      return state;
  }
}
