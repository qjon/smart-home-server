import { HaEntityModel } from '../elements-modules/ha-weather-stations/models/ha-entity.model';

export interface HomeAssistantHassModel {
  auth: {
    data: {
      access_token: string;
    };
  };
  callApi: (method: string, url: string, data?: {[key: string]: any}) => Promise<any>;
  states: {
    [key: string]: HaEntityModel
  };
}
