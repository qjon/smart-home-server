import { HomeAssistantHassModel } from './home-assistant-hass.model';
import { HomeAssistantConfigModel } from './home-assistant-config.model';

export interface HomeAssistantComponentModel<T extends HomeAssistantConfigModel> {
  hass: HomeAssistantHassModel;
  config: T;
}
