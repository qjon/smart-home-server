import { Observable } from 'rxjs';
import { ScheduleDto } from './schedule-dto.interface';

export interface ScheduleStateConnectorInterface {
  load(deviceId): void;

  getList(deviceId: string): Observable<ScheduleDto[]>;
}
