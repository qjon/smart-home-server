import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  ChartType,
  WEATHER_STATION_CONFIGURATION, WeatherStationConfigurationModel,
  WeatherStationDataDto,
  WeatherStationDto,
  WeatherStationsApi,
} from '@rign/sh-weather-stations';

import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { HaWeatherStationAdapterService } from './ha-weather-station-adapter.service';

@Injectable()
export class HaWeatherStationsApiService implements WeatherStationsApi {

  constructor(private httpClient: HttpClient,
              private haWeatherStationAdapterService: HaWeatherStationAdapterService,
              @Inject(WEATHER_STATION_CONFIGURATION) private weatherStationsConfigurationService: WeatherStationConfigurationModel) {
  }

  public getList(): Observable<WeatherStationDto[]> {
    return this.haWeatherStationAdapterService.ipList$
      .pipe(
        filter((weatherStationIPs: string[]) => weatherStationIPs.length > 0),
        switchMap((weatherStationIPs: string[]) => {
          return this.httpClient.get<WeatherStationDto[]>(this.weatherStationsConfigurationService.apiHost + '/api/weather-stations?ip=' + weatherStationIPs.join(';'));
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

    return this.httpClient.get<WeatherStationDataDto[]>(`${this.weatherStationsConfigurationService.apiHost}/api/weather-stations/${id}/data/week`, { params });
  }

  private getAggregateDataForDay(id: string, year: number, month: number, day: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('day', day.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`${this.weatherStationsConfigurationService.apiHost}/api/weather-stations/${id}/data/day`, { params });
  }

  private getAggregateDataForMonth(id: string, year: number, month: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`${this.weatherStationsConfigurationService.apiHost}/api/weather-stations/${id}/data/month`, { params });
  }

  private getAggregateDataForYear(id: string, year: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('year', year.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`${this.weatherStationsConfigurationService.apiHost}/api/weather-stations/${id}/data/year`, { params });
  }
}
