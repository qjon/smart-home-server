import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';

@Component({
  selector: 'sh-weather-station-item',
  templateUrl: './weather-station-item.component.html',
  styleUrls: ['./weather-station-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationItemComponent {

  @Input()
  public weatherStation: WeatherStationDto;

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) { }

  public sync(): void {
    this.weatherStationsStateConnectorService.synchronize(this.weatherStation.id);
  }
}
