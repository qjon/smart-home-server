import { WeatherStationDataEntity } from '../../database/entity/weather-station-data.entity';

export interface WeatherStationDataInterface extends Pick<WeatherStationDataEntity, 'timestamp' | 'temperature' | 'humidity'> {
}

export interface WeatherStationSyncDataInterface {
  time: number;
  temp: string;
  hum: string;
}
