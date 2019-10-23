import {Component, Inject} from '@angular/core';
import {SwitchDeviceModel} from '../../models/switch-device-model';
import {SwitchesDeviceListStateConnectorInterface} from '../../interfaces/switches-device-list-state-connector.interface';
import {SwitchesStateConnectorService} from '../../store/state-connectors/switches-state-connector.service';

@Component({
  selector: 'sh-list',
  templateUrl: './switches-list.component.html',
  styleUrls: ['./switches-list.component.scss'],
})
export class SwitchesListComponent {
  constructor(@Inject(SwitchesStateConnectorService) public deviceListStateConnector: SwitchesDeviceListStateConnectorInterface) {
  }

  public trackSwitch(item: SwitchDeviceModel): string {
    return item.id;
  }
}
