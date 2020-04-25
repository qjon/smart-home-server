import { HaEntityModel } from '../elements-modules/ha-weather-stations/models/ha-entity.model';

export interface HomeAssistantHassModel {
  auth: {
    data: {
      access_token: string;
    };
  };
  states: {
    [key: string]: HaEntityModel
  };
}
