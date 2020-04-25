import { HomeAssistantHassModel } from './home-assistant-hass.model';
import { HomeAssistantConfigModel } from './home-assistant-config.model';

export interface HomeAssistantAdapterModel<T extends HomeAssistantConfigModel> {
  setConfig(config: T): void;

  setHass(hass: HomeAssistantHassModel): void;
}
