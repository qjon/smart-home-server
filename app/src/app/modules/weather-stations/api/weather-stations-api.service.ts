import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { WeatherStationsApiModule } from '@weather-stations/api/weather-stations-api.module';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

@Injectable({
  providedIn: WeatherStationsApiModule,
})
export class WeatherStationsApiService {

  constructor(private httpClient: HttpClient) {
  }

  public getList(): Observable<WeatherStationDto[]> {
    return this.httpClient.get<WeatherStationDto[]>('/api/weather-stations');
  }

  public getData(id: number, from: number, to: number): Observable<WeatherStationDataDto[]> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString());

    return this.httpClient.get<WeatherStationDataDto[]>(`/api/weather-stations/${id}/data`, { params });
  }
}
