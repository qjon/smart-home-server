import { WeatherStationDataEntity } from '../../database/entity/weather-station-data.entity';

export interface WeatherStationDataInterface extends Pick<WeatherStationDataEntity, 'timestamp' | 'temperature' | 'humidity'> {
}
