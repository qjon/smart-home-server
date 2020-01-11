import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleDto } from '../../interfaces/schedule-dto.interface';
import { ScheduleActiveStatusDtoInterface } from '../../interfaces/schedule-active-status-dto-interface';

@Component({
  selector: 'sh-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDetailsComponent {
  @Input()
  public schedule: ScheduleDto;

  @Output()
  public onRemove: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public onActiveChange: EventEmitter<ScheduleActiveStatusDtoInterface> = new EventEmitter<ScheduleActiveStatusDtoInterface>();

  public clickRemove(): void {
    this.onRemove.emit(this.schedule.id);
  }

  public clickActiveChange(isActive: boolean): void {
    this.onActiveChange.emit({scheduleId: this.schedule.id, isActive});
  }

}
