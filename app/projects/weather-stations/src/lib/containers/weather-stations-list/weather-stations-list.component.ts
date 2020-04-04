import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';

@Component({
  selector: 'sh-weather-stations-list',
  templateUrl: './weather-stations-list.component.html',
  styleUrls: ['./weather-stations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationsListComponent {

  public list$: Observable<WeatherStationDto[]>;

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) {
    this.list$ = this.weatherStationsStateConnectorService.list$;


    this.weatherStationsStateConnectorService.setWeatherStationId(null);
  }

  public trackBy(item: WeatherStationDto): number {
    return item.id;
  }

  public refresh(): void {
    this.weatherStationsStateConnectorService.loadList();
  }
}
