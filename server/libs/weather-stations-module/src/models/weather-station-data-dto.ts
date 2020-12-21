export interface WeatherStationDataDto {
  id: number;
  timestamp: number;
  temperature: number;
  humidity: number;
  dewPoint: number;
  pressure: number;
}

export interface WeatherStationAvgDataDto {
  avgHumidity: number;
  avgTemperature: number;
  avgDewPoint: number;
  avgPressure: number;
}

export interface WeatherStationDayAvgDataDto extends WeatherStationAvgDataDto{
  hour: number;
}

export interface WeatherStationMonthAvgDataDto extends WeatherStationAvgDataDto {
  month: number;
  day: number;
}

export interface WeatherStationYearAvgDataDto extends WeatherStationAvgDataDto {
  month: number;
}
