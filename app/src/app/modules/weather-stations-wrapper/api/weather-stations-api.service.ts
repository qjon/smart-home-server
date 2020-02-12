import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { WeatherStationsApiModule } from './weather-stations-api.module';
import { WeatherStationDto } from '../../../../../projects/weather-stations/src/lib/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../../../../../projects/weather-stations/src/lib/interfaces/weather-station-data-dto';

@Injectable({
  providedIn: WeatherStationsApiModule,
})
export class WeatherStationsApiService {

  constructor(private httpClient: HttpClient) {
  }

  public getList(): Observable<WeatherStationDto[]> {
    return this.httpClient.get<WeatherStationDto[]>('/api/weather-stations');
  }

  public getAggregateDataForWeek(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/week`, { params });
  }

  public getAggregateDataForDay(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/day`, { params });
  }

  public getAggregateDataForMonth(id: number, year: number, month: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/month`, { params });
  }

  public getAggregateDataForYear(id: number, year: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data/year`, { params });
  }

  public sync(id: number): Observable<WeatherStationDto> {
    return this.httpClient.get<WeatherStationDto>(`/api/weather-stations/${id}/sync`);
  }
}
