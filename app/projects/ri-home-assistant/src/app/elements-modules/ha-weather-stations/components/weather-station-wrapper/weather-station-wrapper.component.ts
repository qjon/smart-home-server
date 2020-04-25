import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeAssistantComponentModel } from '../../../../models/home-assistant-component.model';
import { HomeAssistantConfigModel } from '../../../../models/home-assistant-config.model';
import { HomeAssistantHassModel } from '../../../../models/home-assistant-hass.model';
import { Router } from '@angular/router';

@Component({
  selector: 'riha-weather-station-wrapper',
  templateUrl: './weather-station-wrapper.component.html',
  styleUrls: ['../../../../../styles.scss', './weather-station-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherStationWrapperComponent implements HomeAssistantComponentModel , OnInit {
  @Input()
  public set config(config: HomeAssistantConfigModel) {
    this._config = config;
  }

  @Input()
  public set hass(hass: HomeAssistantHassModel) {
    this._hass = hass;
  }

  private _config: HomeAssistantConfigModel;

  private _hass: HomeAssistantHassModel;
  constructor(private router: Router) {
  }

  public ngOnInit() {
    // this.router.initialNavigation();
    this.router.navigate([{outlets: {ws: 'ws'}}]);
  }
}
