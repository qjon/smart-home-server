import { Observable } from 'rxjs';

import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';

export interface WeatherStationStateConnectorInterface {
  current$: Observable<WeatherStationDto>;

  data$: Observable<WeatherStationDataDto[]>;

  list$: Observable<WeatherStationDto[]>;

  setWeatherStationId(weatherStationId: number): void;

  loadList(): void;

  loadData(from: number, to: number): void;
}
