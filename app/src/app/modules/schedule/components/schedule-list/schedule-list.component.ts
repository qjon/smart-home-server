import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
  ScheduleLoadSuccessAction,
  ScheduleRemoveAction,
  ScheduleRemoveSuccessAction,
} from '../../store/schedule-actions';
import { Actions, ofType } from '@ngrx/effects';
import { Destroyable } from '@core/classes/destroyable.component';

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

  public list: ScheduleDto[] = [];

  constructor(private cdr: ChangeDetectorRef, private store: Store<any>, private actions$: Actions) {
    super();
  }

  public ngOnInit(): void {
    this.listenOnLoadListSuccess();
    this.listenOnScheduleChangeActiveStatusSuccess();
    this.listenOnScheduleSuccessRemove();

    this.loadScheduleList();
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
    return `${schedule.id.toString()}_${schedule.isActive}`;
  }

  private listenOnLoadListSuccess() {
    this.actions$
      .pipe(
        ofType(ScheduleActions.LoadSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe((action: ScheduleLoadSuccessAction) => {
        this.list = action.payload.scheduleList;
        this.cdr.detectChanges();
      });
  }

  private listenOnScheduleChangeActiveStatusSuccess(): void {
    this.actions$
      .pipe(
        ofType(ScheduleActions.ChangeActiveStatusSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe((action: ScheduleChangeActiveStatusSuccessAction) => {
        const foundSchedule = this.list.find((s: ScheduleDto, i: number) => s.id === action.payload.scheduleId);
        foundSchedule.isActive = action.payload.isActive;
        this.list = [...this.list];
        this.cdr.markForCheck();
      });
  }

  private listenOnScheduleSuccessRemove(): void {
    this.actions$
      .pipe(
        ofType(ScheduleActions.RemoveSuccess),
        takeUntil(this.destroy$),
      )
      .subscribe((action: ScheduleRemoveSuccessAction) => {
        this.list = this.list.filter((s: ScheduleDto, i: number) => s.id !== action.payload.scheduleId);
        this.cdr.markForCheck();
      });
  }

  private loadScheduleList(): void {
    this.store.dispatch(new ScheduleLoadAction({deviceId: this.deviceId}));
  }
}
