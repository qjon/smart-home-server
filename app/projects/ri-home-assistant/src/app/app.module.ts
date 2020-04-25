import { BrowserModule } from '@angular/platform-browser';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { HomeAssistantAdapterModel } from './models/home-assistant-adapter.model';
import { HomeAssistantHassModel } from './models/home-assistant-hass.model';
import { HomeAssistantConfigModel } from './models/home-assistant-config.model';
import { AppRoutingModule } from './app-routing.module';
import { WeatherStationWrapperComponent } from './elements-modules/ha-weather-stations/components/weather-station-wrapper/weather-station-wrapper.component';
import { HaWeatherStationsModule } from './elements-modules/ha-weather-stations/ha-weather-stations.module';
import { environment } from '../../../../src/environments/environment';
import { HaWeatherStationConfigModel } from './elements-modules/ha-weather-stations/models/ha-weather-station-config.model';
import { HaWeatherStationAdapterService } from './elements-modules/ha-weather-stations/services/ha-weather-station-adapter.service';

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
    this.injector.get(HaWeatherStationAdapterService).setConfig(config);
  }

  private weatherStationSetApiToken(hass: HomeAssistantHassModel): void {
    this.injector.get(HaWeatherStationAdapterService).setHass(hass);
  }
}

function customElementPlease<T extends HomeAssistantConfigModel>(component,
                                                                 injector,
                                                                 configCallback: (config: T) => void = (config: T) => {
                                                                 },
                                                                 hassCallback: (hass: HomeAssistantHassModel) => void = (hass: HomeAssistantHassModel) => {
                                                                 }) {
  class NgElement extends HTMLElement {
    private componentRef: ComponentRef<HomeAssistantAdapterModel<T>>;

    public set hass(hass: HomeAssistantHassModel) {
      hassCallback(hass);
    }

    constructor() {
      super();
    }

    public setConfig(config: T): void {
      configCallback(config);
    }

    public getCardSize(): number {
      return 3;
    }

    public connectedCallback(): void {
      console.log('connected')
      initializeComponent(this, component, injector);
    }
  }

  return NgElement;
}

function getComponentFactory(component, injector) {
  const componentFactoryResolver = injector.get(ComponentFactoryResolver);
  return componentFactoryResolver.resolveComponentFactory(component);
}

function initializeComponent(element, component, injector) {
  const childInjector = Injector.create({ providers: [], parent: injector });
  const componentFactory = getComponentFactory(component, injector);
  const projectableNodes = [];
  const componentRef = componentFactory.create(childInjector, projectableNodes, element);
  componentRef.changeDetectorRef.detectChanges();
  const applicationRef = injector.get(ApplicationRef);
  applicationRef.attachView(componentRef.hostView);

  return componentRef;
}
