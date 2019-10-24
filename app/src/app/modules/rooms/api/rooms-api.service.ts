import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RoomWithDevicesDto} from '../interfaces/room-dto.interface';
import {RoomsApiModule} from './rooms-api.module';

export type roomDeviceAction = 'attach' | 'detach';


@Injectable({
  providedIn: RoomsApiModule
})
export class RoomsApiService {

  constructor(private httpClient: HttpClient) {
  }

  public attachOrDetach(roomId: number, deviceId: string, type: roomDeviceAction): Observable<void> {
    return this.httpClient.put<void>(`/api/room/${roomId}/devices`, {type, deviceId, roomId});
  }

  public create(name: string): Observable<RoomWithDevicesDto> {
    return this.httpClient.post<RoomWithDevicesDto>('/api/room', {name});
  }

  public list(): Observable<RoomWithDevicesDto[]> {
    return this.httpClient.get<RoomWithDevicesDto[]>('/api/rooms');
  }

}
