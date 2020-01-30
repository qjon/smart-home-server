export interface WeatherStationDataDto {
  id: number;
  timestamp: number;
  temperature: number;
  humidity: number;
}

export interface WeatherStationAvgDataDto {
  avgHumidity: number;
  avgTemperature: number;
}

export interface WeatherStationDayAvgDataDto extends WeatherStationAvgDataDto{
  hour: number;
}

export interface WeatherStationMonthAvgDataDto extends WeatherStationAvgDataDto{
  day: number;
}

export interface WeatherStationYearAvgDataDto extends WeatherStationAvgDataDto {
  month: number;
}
