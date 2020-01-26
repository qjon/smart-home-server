import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sh-weather-station-item',
  templateUrl: './weather-station-item.component.html',
  styleUrls: ['./weather-station-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
