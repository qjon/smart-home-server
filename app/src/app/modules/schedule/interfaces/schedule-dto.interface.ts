import { TimeValue } from '@rign/sh-core';

export interface ScheduleDto {
  id: number;
  deviceId: string;
  action: boolean;
  day: number;
  time: TimeValue;
  isActive?: boolean;
  lastRunAt?: Date;
}
