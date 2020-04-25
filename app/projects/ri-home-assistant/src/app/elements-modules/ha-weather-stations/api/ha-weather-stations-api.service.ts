import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ChartType, WeatherStationDataDto, WeatherStationDto, WeatherStationsApi } from '@rign/sh-weather-stations';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { HaWeatherStationsApiModule } from './ha-weather-stations-api.module';
import { HaEntityModel } from '../models/ha-entity.model';
import { HaWeatherStationItemConfigModel } from '../models/ha-weather-station-item-config.model';

export type HaEntityStateMap = Map<string, HaEntityModel>;

@Injectable({
  providedIn: HaWeatherStationsApiModule,
})
export class HaWeatherStationsApiService implements WeatherStationsApi {
  private token: string;
  private ws: HaWeatherStationItemConfigModel[] = [];

  constructor(private httpClient: HttpClient) {
  }

  public setToken(token: string) {
    this.token = token;
  }

  public setHaEntities(ws: HaWeatherStationItemConfigModel[]) {
    this.ws = ws;
  }

  public getList(): Observable<WeatherStationDto[]> {
    const headers: HttpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + this.token);

    return this.httpClient.get<HaEntityModel[]>('/api/states', {headers})
      .pipe(
        filter(() => this.ws.length > 0),
        map((entities: HaEntityModel[]): HaEntityStateMap => {
          const state: HaEntityStateMap = new Map<string, HaEntityModel>();

          entities.forEach((entity: HaEntityModel) => {
            state.set(entity.entity_id, entity);
          });

          return state;
        }),
        map((entities: HaEntityStateMap) => {
          return this.ws.map((ws: HaWeatherStationItemConfigModel): WeatherStationDto => {
            const statusEntity: HaEntityModel = entities.get(ws.statusEntityId);
            const tempEntity: HaEntityModel = entities.get(ws.tempEntityId);
            const humEntity: HaEntityModel = entities.get(ws.humEntityId);

            return {
              id: statusEntity.entity_id,
              name: ws.title,
              humidity: parseFloat(humEntity.state),
              temperature: parseFloat(tempEntity.state),
              timestamp: (new Date(statusEntity.last_updated)).getTime()
            };
          });
        }),
      );
  }

  public getAggregateData(type: ChartType.Day | ChartType.Week, id: string, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType.Month, id: string, year: number, month: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType.Year, id: string, year: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType, id: string, year: number, month?: number, day?: number): Observable<WeatherStationDataDto[]> {
    switch (type) {
      case ChartType.Week:
        return this.getAggregateDataForWeek(id, year, month, day);
      case ChartType.Month:
        return this.getAggregateDataForMonth(id, year, month);
      case ChartType.Year:
        return this.getAggregateDataForYear(id, year);
      default:
        return this.getAggregateDataForDay(id, year, month, day);
    }
  }

  private getAggregateDataForWeek(id: string, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/week`, { params });
  }

  private getAggregateDataForDay(id: string, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/day`, { params });
  }

  private getAggregateDataForMonth(id: string, year: number, month: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/month`, { params });
  }

  private getAggregateDataForYear(id: string, year: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/year`, { params });
  }
}
