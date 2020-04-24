import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, DoBootstrap, Injector, NgModule } from '@angular/core';

import { WeatherStationWrapperComponent } from './components/weather-station-wrapper/weather-station-wrapper.component';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { HomeAssistantComponentModel } from './models/home-assistant-component.model';
import { HomeAssistantHassModel } from './models/home-assistant-hass.model';
import { HomeAssistantConfigModel } from './models/home-assistant-config.model';

@NgModule({
  declarations: [
    WeatherStationWrapperComponent,
  ],
  entryComponents: [
    WeatherStationWrapperComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
  }

  public ngDoBootstrap(): void {
    const weatherStationWrapper = customElementPlease(WeatherStationWrapperComponent, this.injector);

    customElements.define('weather-station-wrapper', weatherStationWrapper);
  }
}

function customElementPlease(component, injector) {
  class NgElement extends HTMLElement {
    private componentRef: ComponentRef<HomeAssistantComponentModel>;
    private _config: HomeAssistantConfigModel;
    private _hass: HomeAssistantHassModel;

    public set hass(hass: HomeAssistantHassModel) {
      this._hass = hass;

      this.updateHass();
    }

    constructor() {
      super();
    }

    public setConfig(config: HomeAssistantConfigModel): void {
      this._config = config;

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

