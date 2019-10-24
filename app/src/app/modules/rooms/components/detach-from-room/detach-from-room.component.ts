import {Component, Inject, Input} from '@angular/core';
import {RoomsStateConnectorService} from '../../store/state-connectors/rooms-state-connector.service';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';

@Component({
  selector: 'sh-detach-from-room',
  templateUrl: './detach-from-room.component.html',
  styleUrls: ['./detach-from-room.component.scss']
})
export class DetachFromRoomComponent {

  @Input()
  public deviceId: string;

  @Input()
  public roomId: number;

  constructor(@Inject(RoomsStateConnectorService) public roomsStateConnector: RoomsStateConnectorInterface) {
  }

}
