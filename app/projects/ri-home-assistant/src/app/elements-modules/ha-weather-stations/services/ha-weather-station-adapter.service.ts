import { Inject, Injectable } from '@angular/core';

import { WEATHER_STATIONS_API, WeatherStationDto, WeatherStationsLoadSuccessAction } from '@rign/sh-weather-stations';

import { Store } from '@ngrx/store';

import { HaWeatherStationsServicesModule } from './ha-weather-stations-services.module';
import { HaEntityModel } from '../models/ha-entity.model';
import { HaWeatherStationItemConfigModel } from '../models/ha-weather-station-item-config.model';
import { HaWeatherStationConfigModel } from '../models/ha-weather-station-config.model';
import { HaWeatherStationsApiService } from './ha-weather-stations-api.service';
import { HomeAssistantHassModel } from '../../../models/home-assistant-hass.model';
import { HomeAssistantAdapterModel } from '../../../models/home-assistant-adapter.model';

@Injectable({
  providedIn: HaWeatherStationsServicesModule,
})
export class HaWeatherStationAdapterService implements HomeAssistantAdapterModel<HaWeatherStationConfigModel> {

  private config: HaWeatherStationConfigModel;
  private hass: HomeAssistantHassModel;

  constructor(@Inject(WEATHER_STATIONS_API) private weatherStationApi: HaWeatherStationsApiService,
              private store: Store<any>) {
  }

  public setConfig(config: HaWeatherStationConfigModel): void {
    this.config = config;
  }

  public setHass(hass: HomeAssistantHassModel): void {
    this.hass = hass;

    this.weatherStationApi.setToken(hass.auth.data.access_token);

    this.loadWeatherStations();
  }

  private loadWeatherStations(): void {
    const items: WeatherStationDto[] = this.convertHaEntitiesToWeatherStationDto(this.hass.states, this.config.ws);

    this.store.dispatch(new WeatherStationsLoadSuccessAction({ items }));
  }

  private convertHaEntitiesToWeatherStationDto(entities: { [key: string]: HaEntityModel }, wsList: HaWeatherStationItemConfigModel[]): WeatherStationDto[] {
    return wsList.map((ws: HaWeatherStationItemConfigModel): WeatherStationDto => {
      const statusEntity: HaEntityModel = entities[ws.statusEntityId];
      const tempEntity: HaEntityModel = entities[ws.tempEntityId];
      const humEntity: HaEntityModel = entities[ws.humEntityId];

      return {
        id: statusEntity.entity_id,
        name: ws.title,
        humidity: parseFloat(humEntity.state),
        temperature: parseFloat(tempEntity.state),
        timestamp: (new Date(tempEntity.last_updated)).getTime(),
      };
    });
  }
}
