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

@Component({
  selector: 'sh-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleListComponent implements OnInit {
  @Input()
  public deviceId: string;

  @Output()
  public close: EventEmitter<void> = new EventEmitter<void>();

  public list: ScheduleDto[];

  constructor(private scheduleApiService: ScheduleApiService, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    this.scheduleApiService.get(this.deviceId)
      .subscribe((scheduleList: ScheduleDto[]) => {
        this.list = scheduleList;
        this.cdr.detectChanges();
      });
  }

  public changeActive($event: ScheduleActiveStatusDtoInterface) {
    this.scheduleApiService.toggleActivate(this.deviceId, $event.scheduleId, $event.isActive)
      .subscribe((schedule: ScheduleDto) => {
        const foundSchedule = this.list.find((s: ScheduleDto, i: number) => s.id === schedule.id);
        foundSchedule.isActive = schedule.isActive;
        this.list = [...this.list];
        this.cdr.markForCheck();
      });
  }

  public trackByIdAndActiveStatus(index, schedule: ScheduleDto): string {
    return `${schedule.id.toString()}_${schedule.isActive}`;
  }
}
