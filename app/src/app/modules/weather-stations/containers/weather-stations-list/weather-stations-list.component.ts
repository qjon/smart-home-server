import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { WeatherStationsStateConnectorService } from '@weather-stations/store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

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

    this.weatherStationsStateConnectorService.loadList();
  }

  public trackBy(item: WeatherStationDto): number {
    return item.id;
  }
}
