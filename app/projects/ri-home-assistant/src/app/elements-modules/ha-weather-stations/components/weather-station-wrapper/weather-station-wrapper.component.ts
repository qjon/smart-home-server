import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { WEATHER_STATIONS_API } from '@rign/sh-weather-stations';

import { HomeAssistantComponentModel } from '../../../../models/home-assistant-component.model';
import { HomeAssistantConfigModel } from '../../../../models/home-assistant-config.model';
import { HomeAssistantHassModel } from '../../../../models/home-assistant-hass.model';
import { HaWeatherStationsApiService } from '../../api/ha-weather-stations-api.service';
import { HaWeatherStationConfigModel } from '../../models/ha-weather-station-config.model';

@Component({
  selector: 'riha-weather-station-wrapper',
  templateUrl: './weather-station-wrapper.component.html',
  styleUrls: ['../../../../../styles.scss', './weather-station-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherStationWrapperComponent implements HomeAssistantComponentModel<HaWeatherStationConfigModel>, OnInit {
  @Input()
  public set config(config: HaWeatherStationConfigModel) {
    this._config = config;
    console.log({ config });

    this.apiService.setHaEntities(config.ws);
  }

  @Input()
  public set hass(hass: HomeAssistantHassModel) {
    this._hass = hass;
    console.log({ hass });

    this.apiService.setToken(hass.auth.data.access_token);
  }

  private _config: HomeAssistantConfigModel;

  private _hass: HomeAssistantHassModel;

  constructor(private router: Router,
              @Inject(WEATHER_STATIONS_API) private apiService: HaWeatherStationsApiService) {
  }

  public ngOnInit() {
    this.router.navigate([{ outlets: { ws: 'ws' } }]);
  }
}
