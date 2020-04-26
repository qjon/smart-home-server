import { Component, ChangeDetectionStrategy, Input, Inject, OnInit } from '@angular/core';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import {
  WEATHER_STATION_CONFIGURATION,
  WeatherStationConfigurationModel,
} from '../../interfaces/weather-station-configuration.model';

@Component({
  selector: 'sh-weather-station-item',
  templateUrl: './weather-station-item.component.html',
  styleUrls: ['./weather-station-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationItemComponent implements OnInit {

  @Input()
  public weatherStation: WeatherStationDto;

  public allowDetails: boolean = false;

  public constructor(@Inject(WEATHER_STATION_CONFIGURATION) private wsConfiguration: WeatherStationConfigurationModel) {

  }

  public ngOnInit(): void {
    this.allowDetails = this.wsConfiguration.allowDetails;
  }
}
