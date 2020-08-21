import { HaEntityModel } from '../elements-modules/ha-weather-stations/models/ha-entity.model';

export interface HomeAssistantHassModel {
  auth: {
    data: {
      access_token: string;
    };
  };
  callApi: (method: string, url: string, data?: {[key: string]: any}) => Promise<any>;
  callWS: (data: {type: string, entity_id: string, id: number}) => Promise<any>;
  states: {
    [key: string]: HaEntityModel
  };
}
