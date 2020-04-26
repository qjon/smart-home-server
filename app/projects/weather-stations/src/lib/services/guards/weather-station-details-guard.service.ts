import { Inject, Injectable } from '@angular/core';
import { WeatherStationsServicesModule } from '../weather-stations-services.module';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  WEATHER_STATION_CONFIGURATION,
  WeatherStationConfigurationModel,
} from '../../interfaces/weather-station-configuration.model';

@Injectable({
  providedIn: WeatherStationsServicesModule
})
export class WeatherStationDetailsGuardService implements CanActivate {

  constructor(@Inject(WEATHER_STATION_CONFIGURATION) private wsConfiguration: WeatherStationConfigurationModel) { }

  public canActivate(context: ExecutionContext): boolean {
    return this.wsConfiguration.allowDetails;
  }
}
