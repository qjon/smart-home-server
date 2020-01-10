import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input, Inject } from '@angular/core';
import { ScheduleStateConnectorService } from '../../store/state-connectors/schedule-state-connector.service';
import { ScheduleStateConnectorInterface } from '../../interfaces/schedule-state-connector.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sh-schedule-button',
  templateUrl: './schedule-button.component.html',
  styleUrls: ['./schedule-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleButtonComponent implements OnInit {
  @Input()
  public deviceId: string;

  @Output()
  public onClickButton: EventEmitter<void> = new EventEmitter<void>();

  public numberOfSchedules$: Observable<number>;

  constructor(@Inject(ScheduleStateConnectorService) private scheduleStateConnector: ScheduleStateConnectorInterface) { }

  public ngOnInit(): void {
    this.scheduleStateConnector.load(this.deviceId);

    this.numberOfSchedules$ = this.scheduleStateConnector.getList(this.deviceId)
      .pipe(
        map((list) => list.length)
      );
  }

  public openSchedule(): void {
    this.onClickButton.emit();
  }
}
