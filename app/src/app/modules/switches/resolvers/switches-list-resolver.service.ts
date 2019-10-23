import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SwitchDeviceDto} from '../interfaces/switch-device.interface';
import {Observable} from 'rxjs';
import {SwitchesApiService} from '../api/switches-api.service';
import {tap} from 'rxjs/operators';
import {SwitchesDeviceListStateConnectorInterface} from '../interfaces/switches-device-list-state-connector.interface';
import {SwitchesStateConnectorService} from '../store/state-connectors/switches-state-connector.service';

@Injectable()
export class SwitchesListResolverService implements Resolve<SwitchDeviceDto[]> {
  constructor(private switchesApiService: SwitchesApiService,
              @Inject(SwitchesStateConnectorService) public deviceListStateConnector: SwitchesDeviceListStateConnectorInterface) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SwitchDeviceDto[]> {
    return this.switchesApiService.fetchList()
      .pipe(
        tap((devices) => {
          this.deviceListStateConnector.setDevices(devices);
        })
      );
  }
}
