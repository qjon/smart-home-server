import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

import { WeatherStationStateConnectorInterface } from '@weather-stations/interfaces/weather-station-state-connector.interface';
import { WeatherStationSelectors } from '@weather-stations/store/weather-station-selectors';
import { WeatherStationsStoreModule } from '@weather-stations/store/weather-stations-store.module';
import { WeatherStationsLoadAction } from '@weather-stations/store/weather-stations-actions';

@Injectable({
  providedIn: WeatherStationsStoreModule,
})
export class WeatherStationsStateConnectorService implements WeatherStationStateConnectorInterface {
  public list$: Observable<WeatherStationDto[]>;

  constructor(private store: Store<any>) {
    this.list$ = this.store
      .pipe(
        select(WeatherStationSelectors.list),
      );
  }

  public loadList(): void {
    this.store.dispatch(new WeatherStationsLoadAction());
  }
}
