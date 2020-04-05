import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { WeatherStationsApiModule } from './weather-stations-api.module';
import { ChartType, WeatherStationDataDto, WeatherStationDto, WeatherStationsApi } from '@rign/sh-weather-stations';

@Injectable({
  providedIn: WeatherStationsApiModule,
})
export class WeatherStationsApiService implements WeatherStationsApi{

  constructor(private httpClient: HttpClient) {
  }

  public getList(): Observable<WeatherStationDto[]> {
    return this.httpClient.get<WeatherStationDto[]>('/api/weather-stations');
  }

  public getAggregateData(type: ChartType.Day | ChartType.Week, id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType.Month, id: number, year: number, month: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType.Year, id: number, year: number): Observable<WeatherStationDataDto[]>;
  public getAggregateData(type: ChartType, id: number, year: number, month?: number, day?: number): Observable<WeatherStationDataDto[]> {
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

  private getAggregateDataForWeek(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/week`, { params });
  }

  private getAggregateDataForDay(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/day`, { params });
  }

  private getAggregateDataForMonth(id: number, year: number, month: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/month`, { params });
  }

  private getAggregateDataForYear(id: number, year: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/year`, { params });
  }
}
