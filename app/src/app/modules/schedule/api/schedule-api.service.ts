import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ScheduleApiModule } from './schedule-api.module';
import { ScheduleDto } from '../interfaces/schedule-dto.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: ScheduleApiModule,
})
export class ScheduleApiService {

  constructor(private httpClient: HttpClient) {
  }

  public create(data: Partial<ScheduleDto>): Observable<ScheduleDto> {
    return this.httpClient.post<ScheduleDto>(`/api/schedule/${data.deviceId}`, data);
  }

  public get(deviceId: string): Observable<ScheduleDto[]> {
    return this.httpClient.get<ScheduleDto[]>(`/api/schedule/${deviceId}`);
  }
}
