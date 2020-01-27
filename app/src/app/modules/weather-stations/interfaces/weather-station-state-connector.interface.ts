import { Observable } from 'rxjs';

import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

export interface WeatherStationStateConnectorInterface {
  list$: Observable<WeatherStationDto[]>;

  loadList(): void;
}
