import { WeatherStationApiResponse } from './weather-station-api-response';

export interface WeatherStationSync {
  toSync: string[];
}

export interface WeatherStationSyncResponse extends WeatherStationApiResponse<WeatherStationSync> {

}
