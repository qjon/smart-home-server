import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sh-weather-stations-list',
  templateUrl: './weather-stations-list.component.html',
  styleUrls: ['./weather-stations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherStationsListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
