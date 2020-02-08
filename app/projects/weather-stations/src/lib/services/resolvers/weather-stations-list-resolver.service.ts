import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { WeatherStationsServicesModule } from '../weather-stations-services.module';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';

@Injectable({
  providedIn: WeatherStationsServicesModule,
})
export class WeatherStationsListResolverService implements Resolve<boolean> {

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.weatherStationsStateConnectorService.loadList();

    return this.weatherStationsStateConnectorService.list$
      .pipe(
        first(),
        map((data) => data.length > 0),
      );
  }
}
