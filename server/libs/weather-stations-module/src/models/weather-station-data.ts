import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';

export interface WeatherStationDataInterface extends Pick<WeatherStationDataEntity, 'timestamp' | 'temperature' | 'humidity'> {
  dewPoint: number;
  pressure: number;
}

export interface WeatherStationSyncDataInterface {
  time: number;
  temp: string;
  hum: string;
  dewPoint: string;
  pressure: string;
}
