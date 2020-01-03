export interface TimeValue {
  hours: number;
  minutes: number;
}

export interface ScheduleInterface {
  id: number;
  deviceId: string;
  action: boolean;
  day: number;
  time: TimeValue;
  isActive?: boolean;
  lastRunAt?: Date;
}
