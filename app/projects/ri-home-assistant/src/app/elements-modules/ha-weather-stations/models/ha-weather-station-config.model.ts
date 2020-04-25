import { HomeAssistantConfigModel } from '../../../models/home-assistant-config.model';
import { HaWeatherStationItemConfigModel } from './ha-weather-station-item-config.model';

export interface HaWeatherStationConfigModel extends HomeAssistantConfigModel {
  ws: HaWeatherStationItemConfigModel[];
}
