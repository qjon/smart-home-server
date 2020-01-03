import { TimeValue } from '@core/form/fields/time-field/time-field.component';

export interface ScheduleDto {
  id: number;
  deviceId: string;
  action: boolean;
  day: number;
  time: TimeValue;
  isActive?: boolean;
  lastRunAt?: Date;
}
