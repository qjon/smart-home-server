import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RoomsStateConnectorService} from '../../store/state-connectors/rooms-state-connector.service';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';
import {FormControl} from '@angular/forms';
import {RoomWithDevicesDto} from '../../interfaces/room-dto.interface';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sh-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.scss']
})
export class SelectRoomComponent implements OnInit, OnDestroy {

  public roomControl = new FormControl(null);

  private destroy$ = new ReplaySubject<void>(1);

  constructor(@Inject(RoomsStateConnectorService) public roomsStateConnector: RoomsStateConnectorInterface) {
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.roomControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((room: RoomWithDevicesDto) => this.roomsStateConnector.selectRoom(room.id));
  }

  public compare(option: RoomWithDevicesDto, formValue: RoomWithDevicesDto): boolean {
    return (formValue === null && option.id === null) || option.id === formValue.id;
  }
}
