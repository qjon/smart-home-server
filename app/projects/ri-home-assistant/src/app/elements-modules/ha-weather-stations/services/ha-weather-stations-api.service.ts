import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ChartType, WeatherStationDataDto, WeatherStationDto, WeatherStationsApi } from '@rign/sh-weather-stations';

import { forkJoin, Observable, throwError } from 'rxjs';

import { HaWeatherStationsServicesModule } from './ha-weather-stations-services.module';
import { HaWeatherStationAdapterService } from './ha-weather-station-adapter.service';
import { HaEntityModel } from '../models/ha-entity.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: HaWeatherStationsServicesModule,
})
export class HaWeatherStationsApiService implements WeatherStationsApi {
  constructor(private httpClient: HttpClient,
              private adapter: HaWeatherStationAdapterService) {
  }

  public getList(): Observable<WeatherStationDto[]> {

    return throwError('not need to be implemented');
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
    const { hum, temp } = this.adapter.getTempAndHumId(id);

    const fromDate: Date = new Date(year, month, day, 0, 0, 0);
    const from: string = fromDate.toISOString();
    const toDate: Date = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + 1);
    const to: string = toDate.toISOString();

    return this.fetchDataForDay(temp + ',' + hum, from, to)
      .pipe(
        map((data: Array<HaEntityModel[]>): WeatherStationDataDto[] => {
          return this.adapter.convertDayItemsToDataDto(data);
        }),
      );
  }

  private fetchDataForDay(id: string, from: string, to: string): Observable<Array<HaEntityModel[]>> {
    const headers: HttpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + this.adapter.getToken());

    const params = new HttpParams()
      .set('end_date', to)
      .set('filter_entity_id', id);

    return this.httpClient.get<Array<HaEntityModel[]>>(`/api/history/period/${from}`, { params, headers });
  }

  private getAggregateDataForMonth(id: string, year: number, month: number): Observable<WeatherStationDataDto[]> {
    const { hum, temp } = this.adapter.getTempAndHumId(id);

    const fromDate: Date = new Date(year, month, 1, 0, 0, 0);
    let from: string = fromDate.toISOString();
    const toDate: Date = new Date(fromDate);
    toDate.setMonth(fromDate.getMonth() + 1);
    const to: string = toDate.toISOString();

    from = this.cutMaxPastDate(year, month);

    return this.fetchDataForDay(temp + ',' + hum, from, to)
      .pipe(
        map((data: Array<HaEntityModel[]>): WeatherStationDataDto[] => {
          return this.adapter.convertMonthItemsToDataDto(data);
        }),
      );


    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/month`, { params });
  }

  private cutMaxPastDate(year: number, month: number): string {
    const fromDate: Date = new Date(year, month, (year === 2020 && month === 3) ? 23 : 1, 0, 0, 0);
    return fromDate.toISOString();
  }

  private getAggregateDataForYear(id: string, year: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/year`, { params });
  }
}
