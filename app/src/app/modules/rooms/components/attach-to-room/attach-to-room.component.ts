import {Component, Inject, Input} from '@angular/core';
import {RoomsStateConnectorService} from '../../store/state-connectors/rooms-state-connector.service';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';

@Component({
  selector: 'sh-attach-to-room',
  templateUrl: './attach-to-room.component.html',
  styleUrls: ['./attach-to-room.component.scss']
})
export class AttachToRoomComponent {

  @Input()
  public deviceId: string;

  constructor(@Inject(RoomsStateConnectorService) public roomsStateConnector: RoomsStateConnectorInterface) {
  }
}
