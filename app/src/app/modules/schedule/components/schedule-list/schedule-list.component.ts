import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter, Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ScheduleApiService } from '../../api/schedule-api.service';
import { ScheduleDto } from '../../interfaces/schedule-dto.interface';
import { ScheduleActiveStatusDtoInterface } from '../../interfaces/schedule-active-status-dto-interface';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  ScheduleActions,
  ScheduleChangeActiveStatusAction,
  ScheduleChangeActiveStatusSuccessAction,
  ScheduleLoadAction,
  ScheduleLoadSuccessAction, ScheduleOpenAddModalAction,
  ScheduleRemoveAction,
  ScheduleRemoveSuccessAction,
} from '../../store/schedule-actions';
import { Actions, ofType } from '@ngrx/effects';
import { Destroyable } from '@rign/sh-core';
import { ScheduleStateConnectorInterface } from '../../interfaces/schedule-state-connector.interface';
import { ScheduleStateConnectorService } from '../../store/state-connectors/schedule-state-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'sh-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleListComponent extends Destroyable implements OnInit {
  @Input()
  public deviceId: string;

  @Output()
  public close: EventEmitter<void> = new EventEmitter<void>();

  public list$: Observable<ScheduleDto[]>;

  constructor(private store: Store<any>,
              @Inject(ScheduleStateConnectorService) private scheduleStateConnector: ScheduleStateConnectorInterface) {
    super();
  }

  public ngOnInit(): void {
    this.list$ = this.scheduleStateConnector.getList(this.deviceId);
  }

  public addSchedule(): void {
    this.store.dispatch(new ScheduleOpenAddModalAction({deviceId: this.deviceId}));
  }

  public changeActive($event: ScheduleActiveStatusDtoInterface) {
    this.store.dispatch(new ScheduleChangeActiveStatusAction({
      deviceId: this.deviceId,
      scheduleId: $event.scheduleId,
      isActive: $event.isActive,
    }));
  }

  public remove(scheduleId: number) {
    this.store.dispatch(new ScheduleRemoveAction({ deviceId: this.deviceId, scheduleId: scheduleId }));
  }

  public trackByIdAndActiveStatus(index, schedule: ScheduleDto): string {
    return schedule.id.toString();
  }
}
