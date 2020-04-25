import { Injectable } from '@angular/core';
import { WeatherStationsServicesModule } from '../weather-stations-services.module';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: WeatherStationsServicesModule,
})
export class WeatherStationIdResolverService implements Resolve<string> {

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
    const weatherStationId: string = route.paramMap.get('weatherStationId');

    this.weatherStationsStateConnectorService.setWeatherStationId(weatherStationId);

    return weatherStationId;
  }
}
