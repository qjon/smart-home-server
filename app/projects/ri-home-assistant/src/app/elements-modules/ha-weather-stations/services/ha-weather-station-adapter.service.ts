import { Injectable } from '@angular/core';

import { WeatherStationsStateConnectorService } from '@rign/sh-weather-stations';


import { isEqual } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map } from 'rxjs/operators';

import { HaWeatherStationsServicesModule } from './ha-weather-stations-services.module';
import { HaWeatherStationItemConfigModel } from '../models/ha-weather-station-item-config.model';
import { HaWeatherStationConfigModel } from '../models/ha-weather-station-config.model';
import { HomeAssistantHassModel } from '../../../models/home-assistant-hass.model';
import { HomeAssistantAdapterModel } from '../../../models/home-assistant-adapter.model';
import { HaEntityModel } from '../models/ha-entity.model';

@Injectable({
  providedIn: HaWeatherStationsServicesModule,
})
export class HaWeatherStationAdapterService implements HomeAssistantAdapterModel<HaWeatherStationConfigModel> {
  public readonly ipList$: Observable<string[]>;

  private config: HaWeatherStationConfigModel;

  private hass: HomeAssistantHassModel;

  private entitiesLastUpdate: { [key: string]: string } = {};

  private ipList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private hasIpList: boolean = false;

  public constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) {
    this.ipList$ = this.ipList.asObservable();
  }

  public getToken(): string {
    return this.hass.auth.data.access_token;
  }

  public setConfig(config: HaWeatherStationConfigModel): void {
    this.config = config;

  }

  public setHass(hass: HomeAssistantHassModel): void {
    this.hass = hass;

    const entitiesLastUpdate: { [key: string]: string } = this.getConfigEntitiesLastUpdate();

    if (!isEqual(this.entitiesLastUpdate, entitiesLastUpdate)) {
      this.entitiesLastUpdate = entitiesLastUpdate;

      this.weatherStationsStateConnectorService.loadList();

      if (!this.hasIpList) {
        const ips$: Observable<string>[] = [];

        this.config.ws.forEach((item: HaWeatherStationItemConfigModel) => {
          ips$.push(this.convertEntityIdToIp(item.entityId));
        });

        combineLatest(...ips$)
          .pipe(
            first()
          )
          .subscribe((ips: string[]) => {
            this.ipList.next(ips);
          });

        this.hasIpList = true;
      }
    }
  }

  private getConfigEntitiesLastUpdate(): { [key: string]: string } {
    const entities: { [key: string]: string } = {};

    if (this.isHassState()) {
      this.config.ws.forEach((ws: HaWeatherStationItemConfigModel) => {
        entities[ws.entityId] = this.hass.states[ws.entityId].last_changed;
      });
    }

    return entities;
  }

  private convertEntityIdToIp(entityId: string): Observable<string> {
    const state: HaEntityModel = this.hass.states[entityId];

    const entityIpAddress = this.getIpAddressFromEntityState(state);
    if (entityIpAddress) {
      return of(entityIpAddress);
    } else {
      return fromPromise(this.hass.callApi('get', 'history/period/2020-05-14T17:10:00?end_date=2020-05-14T17:40:00&filter_entity_id=' + entityId))
        .pipe(
          map((response: Array<HaEntityModel[]>) => {
            const foundNotEmptySate: HaEntityModel = response[0].find((item: HaEntityModel) => {
              const itemIpAddress = this.getIpAddressFromEntityState(item);

              return Boolean(itemIpAddress);
            });
            return this.getIpAddressFromEntityState(foundNotEmptySate);
          }),
        );
    }
  }

  private getIpAddressFromEntityState(state: HaEntityModel): string | null {
    return state && state.attributes && state.attributes.IPAddress ? state.attributes.IPAddress : null;
  }

  private isHassState(): boolean {
    return Boolean(this.hass && this.hass.states);
  }
}
