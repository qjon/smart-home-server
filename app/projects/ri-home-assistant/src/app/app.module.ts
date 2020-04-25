import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, DoBootstrap, Injector, NgModule } from '@angular/core';

import { WEATHER_STATIONS_API } from '@rign/sh-weather-stations';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { HomeAssistantComponentModel } from './models/home-assistant-component.model';
import { HomeAssistantHassModel } from './models/home-assistant-hass.model';
import { HomeAssistantConfigModel } from './models/home-assistant-config.model';
import { AppRoutingModule } from './app-routing.module';
import { WeatherStationWrapperComponent } from './elements-modules/ha-weather-stations/components/weather-station-wrapper/weather-station-wrapper.component';
import { HaWeatherStationsModule } from './elements-modules/ha-weather-stations/ha-weather-stations.module';
import { environment } from '../../../../src/environments/environment';
import { HaWeatherStationConfigModel } from './elements-modules/ha-weather-stations/models/ha-weather-station-config.model';
import { HaWeatherStationsApiService } from './elements-modules/ha-weather-stations/api/ha-weather-stations-api.service';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    EffectsModule.forRoot([]),
    HaWeatherStationsModule,
    SimpleNotificationsModule.forRoot({
      timeOut: 3000,
      showProgressBar: true,
      clickToClose: false,
    }),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
  }

  public ngDoBootstrap(): void {
    const weatherStationWrapper = customElementPlease<HaWeatherStationConfigModel>(
      WeatherStationWrapperComponent,
      this.injector,
      this.weatherStationSetApiConfig.bind(this),
      this.weatherStationSetApiToken.bind(this),
    );

    customElements.define('weather-station-wrapper', weatherStationWrapper);
  }

  private weatherStationSetApiConfig(config: HaWeatherStationConfigModel): void {
    (this.injector.get(WEATHER_STATIONS_API) as HaWeatherStationsApiService).setHaEntities(config.ws);
  }

  private weatherStationSetApiToken(hass: HomeAssistantHassModel): void {
    (this.injector.get(WEATHER_STATIONS_API) as HaWeatherStationsApiService).setToken(hass.auth.data.access_token);
  }
}

function customElementPlease<T extends HomeAssistantConfigModel>(component,
                                                                 injector,
                                                                 configCallback: (config: T) => void = (config: T) => {
                                                                 },
                                                                 hassCallback: (hass: HomeAssistantHassModel) => void = (hass: HomeAssistantHassModel) => {
                                                                 }) {
  class NgElement extends HTMLElement {
    private componentRef: ComponentRef<HomeAssistantComponentModel<T>>;
    private _config: T;
    private _hass: HomeAssistantHassModel;

    public set hass(hass: HomeAssistantHassModel) {
      this._hass = hass;

      hassCallback(hass);

      this.updateHass();
    }

    constructor() {
      super();
    }

    public setConfig(config: T): void {
      this._config = config;
      configCallback(config);

      this.initConfig();
    }

    public getCardSize(): number {
      return 3;
    }

    public connectedCallback(): void {
      if (!this.componentRef) {
        this.componentRef = initializeComponent(this, component, injector);

        this.initConfig();
        this.updateHass();
      }
    }

    public attributeChangedCallback(attrName, oldValue, newValue): void {
      if (!this.componentRef) {
        this.componentRef = initializeComponent(this, component, injector);

        this.initConfig();
        this.updateHass();
      }
    }

    private initConfig(): void {
      if (this._config && this.componentRef) {
        this.componentRef.instance.config = this._config;
      }
    }

    private updateHass(): void {
      if (this._hass && this.componentRef) {
        this.componentRef.instance.hass = this._hass;
      }
    }
  }

  return NgElement;
}

function getComponentFactory(component, injector) {
  const componentFactoryResolver = injector.get(ComponentFactoryResolver);
  return componentFactoryResolver.resolveComponentFactory(component);
}

function initializeComponent(element, component, injector) {
  console.log('init Component');

  const childInjector = Injector.create({ providers: [], parent: injector });
  const componentFactory = getComponentFactory(component, injector);
  const projectableNodes = [];
  let componentRef = componentFactory.create(childInjector, projectableNodes, element);
  componentRef.changeDetectorRef.detectChanges();
  const applicationRef = injector.get(ApplicationRef);
  applicationRef.attachView(componentRef.hostView);

  return componentRef;
}
