import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

@Component({
  selector: 'sh-weather-station-item',
  templateUrl: './weather-station-item.component.html',
  styleUrls: ['./weather-station-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationItemComponent implements OnInit {

  @Input()
  public weatherStation: WeatherStationDto;

  constructor() { }

  ngOnInit() {
  }

}
