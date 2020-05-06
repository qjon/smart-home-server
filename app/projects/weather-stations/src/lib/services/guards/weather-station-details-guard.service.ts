import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { WeatherStationsServicesModule } from '../weather-stations-services.module';
import {
  WEATHER_STATION_CONFIGURATION,
  WeatherStationConfigurationModel,
} from '../../interfaces/weather-station-configuration.model';

@Injectable({
  providedIn: WeatherStationsServicesModule
})
export class WeatherStationDetailsGuardService implements CanActivate {

  constructor(@Inject(WEATHER_STATION_CONFIGURATION) private wsConfiguration: WeatherStationConfigurationModel) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.wsConfiguration.allowDetails;
  }
}
