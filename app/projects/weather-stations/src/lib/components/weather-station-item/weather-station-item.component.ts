import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';

@Component({
  selector: 'sh-weather-station-item',
  templateUrl: './weather-station-item.component.html',
  styleUrls: ['./weather-station-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationItemComponent {

  @Input()
  public weatherStation: WeatherStationDto;
}
