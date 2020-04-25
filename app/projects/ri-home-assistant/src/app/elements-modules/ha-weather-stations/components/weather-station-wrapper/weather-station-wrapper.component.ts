import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'riha-weather-station-wrapper',
  templateUrl: './weather-station-wrapper.component.html',
  styleUrls: ['../../../../../styles.scss', './weather-station-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherStationWrapperComponent implements OnInit {
  constructor(private router: Router) {
  }

  public ngOnInit() {
    this.router.navigate([{ outlets: { ws: 'ws' } }]);
  }
}
