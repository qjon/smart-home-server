import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ScheduleApiModule } from './schedule-api.module';
import { ScheduleDto } from '../interfaces/schedule-dto.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  public remove(deviceId: string, scheduleId: number): Observable<boolean> {
    return this.httpClient.delete<void>(`/api/schedule/${deviceId}/${scheduleId}`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  public toggleActivate(deviceId: string, scheduleId: number, isActive: boolean): Observable<ScheduleDto> {
    return this.httpClient.put<ScheduleDto>(`/api/schedule/${deviceId}/${scheduleId}`, {isActive: isActive});
  }
}
