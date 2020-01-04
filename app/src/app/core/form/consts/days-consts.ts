export enum Days {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum ShortDayName {
  Monday = 'M',
  Tuesday = 'T',
  Wednesday = 'W',
  Thursday = 'T',
  Friday = 'F',
  Saturday = 'S',
  Sunday = 'S',
}

export enum MediumDayName {
  Monday = 'Mon',
  Tuesday = 'Tue',
  Wednesday = 'Wed',
  Thursday = 'Thu',
  Friday = 'Fri',
  Saturday = 'Sat',
  Sunday = 'Sun',
}

export enum LongDayName {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum DayValue {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 4,
  Thursday = 8,
  Friday = 16,
  Saturday = 32,
  Sunday = 64,
}

export interface Day {
  symbol: Days;
  value: DayValue;
}

export const days: Day[] = [
  {
    symbol: Days.Monday,
    value: DayValue.Monday,
  },
  {
    symbol: Days.Tuesday,
    value: DayValue.Tuesday,
  },
  {
    symbol: Days.Wednesday,
    value: DayValue.Wednesday,
  },
  {
    symbol: Days.Thursday,
    value: DayValue.Thursday,
  },
  {
    symbol: Days.Friday,
    value: DayValue.Friday,
  },
  {
    symbol: Days.Saturday,
    value: DayValue.Saturday,
  },
  {
    symbol: Days.Sunday,
    value: DayValue.Sunday,
  },
];
export type DayType = 'short' | 'medium' | 'long';
