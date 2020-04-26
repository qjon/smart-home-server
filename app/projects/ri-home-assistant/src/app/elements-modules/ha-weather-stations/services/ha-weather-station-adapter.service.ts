import { Injectable } from '@angular/core';

import { WeatherStationDataDto, WeatherStationDto, WeatherStationsLoadSuccessAction } from '@rign/sh-weather-stations';

import { Store } from '@ngrx/store';

import { HaWeatherStationsServicesModule } from './ha-weather-stations-services.module';
import { HaEntityModel } from '../models/ha-entity.model';
import { HaWeatherStationItemConfigModel } from '../models/ha-weather-station-item-config.model';
import { HaWeatherStationConfigModel } from '../models/ha-weather-station-config.model';
import { HomeAssistantHassModel } from '../../../models/home-assistant-hass.model';
import { HomeAssistantAdapterModel } from '../../../models/home-assistant-adapter.model';

type AggregatedData = Map<string, number>;

@Injectable({
  providedIn: HaWeatherStationsServicesModule,
})
export class HaWeatherStationAdapterService implements HomeAssistantAdapterModel<HaWeatherStationConfigModel> {

  private config: HaWeatherStationConfigModel;
  private hass: HomeAssistantHassModel;

  constructor(private store: Store<any>) {
  }

  public convertDayItemsToDataDto(data: Array<HaEntityModel[]>): WeatherStationDataDto[] {
    const itemsData: WeatherStationDataDto[] = [];

    const tempAggregatedData = this.aggregateData(data[0], (date: Date) => date.getHours(), 0);
    const humAggregatedData = this.aggregateData(data[1], (date: Date) => date.getHours(), 0);

    const date = new Date(Date.parse(data[0][0].last_updated));

    for (let i = 0; i < 24; i++) {
      date.setHours(i);
      date.setMinutes(0);

      const id = i.toString();
      itemsData.push({
        id,
        humidity: humAggregatedData.has(id) ? humAggregatedData.get(id) : null,
        temperature: tempAggregatedData.has(id) ? tempAggregatedData.get(id) : null,
        timestamp: date.getTime(),
      });
    }

    return itemsData;
  }

  public convertMonthItemsToDataDto(data: Array<HaEntityModel[]>): WeatherStationDataDto[] {
    const itemsData: WeatherStationDataDto[] = [];

    const tempAggregatedData = this.aggregateData(data[0], (date: Date) => date.getDate(), 1);
    const humAggregatedData = this.aggregateData(data[1], (date: Date) => date.getDate(), 1);

    const date = new Date(Date.parse(data[0][0].last_updated));

    const dateTmp = new Date(date);
    dateTmp.setMonth(dateTmp.getMonth() + 1);
    dateTmp.setDate(dateTmp.getDate() - 1);
    const lastDayInMonth = dateTmp.getDate();

    for (let i = 0; i < lastDayInMonth; i++) {
      date.setDate(i);
      date.setHours(0);
      date.setMinutes(0);

      const id = i.toString();
      itemsData.push({
        id,
        humidity: humAggregatedData.has(id) ? humAggregatedData.get(id) : null,
        temperature: tempAggregatedData.has(id) ? tempAggregatedData.get(id) : null,
        timestamp: date.getTime(),
      });
    }

    return itemsData;
  }

  public getTempAndHumId(statusId: string): { hum: string; temp: string } {
    const item: HaWeatherStationItemConfigModel = this.config.ws.find((ws: HaWeatherStationItemConfigModel) => ws.statusEntityId === statusId);

    return { hum: item.humEntityId, temp: item.tempEntityId };
  }

  public getToken(): string {
    return this.hass.auth.data.access_token;
  }

  public setConfig(config: HaWeatherStationConfigModel): void {
    this.config = config;
  }

  public setHass(hass: HomeAssistantHassModel): void {
    this.hass = hass;

    this.loadWeatherStations();
  }

  private aggregateDataByHour(data: HaEntityModel[]): AggregatedData {
    let value: number = 0;
    let items: number = null;
    let lastHour: number = 0;

    const aggregatedData: AggregatedData = new Map<string, number>();

    data.forEach((item: HaEntityModel) => {
      const date = new Date(Date.parse(item.last_updated));

      const tempValue = parseFloat(item.state);

      if (isNaN(tempValue)) {
        return;
      } else if (date.getHours() === lastHour) {
        value += tempValue;
        items = items ? items + 1 : 1;
      } else if (items === null) {
        value = tempValue;
        items = 1;
        lastHour = date.getHours();
      } else {
        if (!Boolean(items)) {
          return;
        }

        aggregatedData.set(lastHour.toString(), Math.round(value / items * 100) / 100);

        value = tempValue;
        items = 1;
        lastHour = date.getHours();
      }
    });

    return aggregatedData;
  }

  private aggregateData(data: HaEntityModel[], aggregationCallback: (date: Date) => number, startAggregationValue: number = 0): AggregatedData {
    let value: number = 0;
    let items: number = null;
    let aggregationCompareValue: number = startAggregationValue;

    const aggregatedData: AggregatedData = new Map<string, number>();

    data.forEach((item: HaEntityModel) => {
      const date = new Date(Date.parse(item.last_updated));

      const tempValue = parseFloat(item.state);

      const currentDate = aggregationCallback(date);

      if (isNaN(tempValue)) {
        return;
      } else if (currentDate === aggregationCompareValue) {
        value += tempValue;
        items = items ? items + 1 : 1;
      } else if (items === null) {
        value = tempValue;
        items = 1;
        aggregationCompareValue = currentDate;
      } else {
        if (!Boolean(items)) {
          return;
        }

        aggregatedData.set(aggregationCompareValue.toString(), Math.round(value / items * 100) / 100);

        value = tempValue;
        items = 1;
        aggregationCompareValue = currentDate;
      }
    });

    return aggregatedData;
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
