import {createFeatureSelector, createSelector} from '@ngrx/store';
import { SCHEDULES_STATE, ScheduleState } from './schedule-reducer';
import { ScheduleDto } from '../interfaces/schedule-dto.interface';

const scheduleFeatureSelector = createFeatureSelector<ScheduleState>(SCHEDULES_STATE);

const scheduleListSelector = createSelector(
  scheduleFeatureSelector,
  (s: ScheduleState, params: { deviceId: string }): ScheduleDto[] => s[params.deviceId] ? s[params.deviceId].ids.map(id => s[params.deviceId].scheduleList[id]) : []
);
export const scheduleSelectors = {
  scheduleFeatureSelector,
  scheduleListSelector,
};
