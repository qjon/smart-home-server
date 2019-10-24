import {Injectable} from '@angular/core';
import {GuardsModule} from '../guards.module';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {switchesSelectors} from '../../store/switches-selectors';
import {map, take} from 'rxjs/operators';
import {DeviceDetailsStateConnectorService} from '../../store/state-connectors/device-details-state-connector.service';
import {SwitchDeviceModel} from '../../models/switch-device-model';

@Injectable({
  providedIn: GuardsModule
})
export class CanActivateDeviceDetailsService implements CanActivate {

  constructor(private store: Store<any>,
              private deviceDetailsStateConnectorService: DeviceDetailsStateConnectorService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const deviceId = route.params['id'];

    return this.store
      .pipe(
        select(switchesSelectors.deviceSelector, {deviceId}),
        take(1),
        map((device: SwitchDeviceModel) => {
          if (device) {
            this.deviceDetailsStateConnectorService.setCurrentDeviceId(deviceId);

            return true;
          } else {
            this.deviceDetailsStateConnectorService.setCurrentDeviceId(null);

            this.router.navigate(['/']);

            return false;
          }
        })
      );
  }
}
