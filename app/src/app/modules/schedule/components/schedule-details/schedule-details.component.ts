import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ScheduleDto } from '../../interfaces/schedule-dto.interface';

@Component({
  selector: 'sh-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDetailsComponent implements OnInit {
  @Input()
  public schedule: ScheduleDto;

  constructor() { }

  ngOnInit() {
  }

}
