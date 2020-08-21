import { Injectable } from '@angular/core';

import { isEqual } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { HaWeatherStationsServicesModule } from './ha-weather-stations-services.module';
import { HaWeatherStationItemConfigModel } from '../models/ha-weather-station-item-config.model';
import { HaWeatherStationConfigModel } from '../models/ha-weather-station-config.model';
import { HomeAssistantHassModel } from '../../../models/home-assistant-hass.model';
import { HomeAssistantAdapterModel } from '../../../models/home-assistant-adapter.model';
import { HaEntityRegistryModel } from '../models/ha-entity-registry.model';

@Injectable({
  providedIn: HaWeatherStationsServicesModule,
})
export class HaWeatherStationAdapterService implements HomeAssistantAdapterModel<HaWeatherStationConfigModel> {
  public readonly uniqIds$: Observable<string[]>;

  private config: HaWeatherStationConfigModel;

  private hass: HomeAssistantHassModel;

  private entitiesLastUpdate: { [key: string]: string } = {};

  private uniqIds: BehaviorSubject<Map<string, string>> = new BehaviorSubject<Map<string, string>>(new Map());

  private uniqIdMap: Map<string, string> = new Map<string, string>();

  public constructor() {
    this.uniqIds$ = this.uniqIds.asObservable()
      .pipe(
        map((uniqIds: Map<string, any>) => Array.from(uniqIds.values())),
        filter((uniqIdList: string[]) => uniqIdList && uniqIdList.length > 0 && !uniqIdList.some(x => x === null)),
      );
  }

  public getToken(): string {
    return this.hass.auth.data.access_token;
  }

  public setConfig(config: HaWeatherStationConfigModel): void {
    this.config = config;

    config.ws.forEach((ws: HaWeatherStationItemConfigModel) => {
      this.uniqIdMap.set(ws.entityId, null);
    });
  }

  public setHass(hass: HomeAssistantHassModel): void {
    this.hass = hass;

    const entitiesLastUpdate: { [key: string]: string } = this.getConfigEntitiesLastUpdate();

    if (!isEqual(this.entitiesLastUpdate, entitiesLastUpdate)) {

      const promiseArray = [];

      let id: number = Math.ceil(Math.random() * 10000);

      this.config.ws.forEach((ws: HaWeatherStationItemConfigModel) => {
        promiseArray.push(this.hass.callWS({ type: 'config/entity_registry/get', entity_id: ws.entityId, id: ++id }));
      });

      Promise.all(promiseArray)
        .then((items: HaEntityRegistryModel[]) => {
          items.map((entity: HaEntityRegistryModel) => {
            this.uniqIdMap.set(entity.entity_id, entity.unique_id);
          });

          this.uniqIds.next(this.uniqIdMap);
        });


      this.entitiesLastUpdate = entitiesLastUpdate;
    }
  }

  private getConfigEntitiesLastUpdate(): { [key: string]: string } {
    const entities: { [key: string]: string } = {};

    if (this.isHassState()) {
      this.config.ws.forEach((ws: HaWeatherStationItemConfigModel) => {
        entities[ws.entityId] = this.hass.states[ws.entityId].context.id;
      });
    }

    return entities;
  }

  private isHassState(): boolean {
    return Boolean(this.hass && this.hass.states);
  }
}
