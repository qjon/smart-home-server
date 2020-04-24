import { Component, Input } from '@angular/core';
import { HomeAssistantComponentModel } from '../../models/home-assistant-component.model';
import { HomeAssistantConfigModel } from '../../models/home-assistant-config.model';
import { HomeAssistantHassModel } from '../../models/home-assistant-hass.model';

@Component({
  selector: 'riha-weather-station-wrapper',
  templateUrl: './weather-station-wrapper.component.html',
  styleUrls: ['./weather-station-wrapper.component.scss'],
})
export class WeatherStationWrapperComponent implements HomeAssistantComponentModel {
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

  constructor() {
    console.log(this);
  }
}
