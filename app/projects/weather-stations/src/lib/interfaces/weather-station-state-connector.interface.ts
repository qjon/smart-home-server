import { Observable } from 'rxjs';

import { WeatherStationDto } from './weather-station-dto';
import { WeatherStationDataDto } from './weather-station-data-dto';

export interface WeatherStationStateConnectorInterface {
  current$: Observable<WeatherStationDto>;

  data$: Observable<WeatherStationDataDto[]>;

  list$: Observable<WeatherStationDto[]>;

  setWeatherStationId(weatherStationId: number): void;

  loadList(): void;

  loadAggregateDataForDay(year: number, month: number, day: number): void;

  loadAggregateDataForWeek(year: number, month: number, day: number): void;

  loadDataForMonth(year: number, month: number): void;

  loadDataForYear(year: number): void;
}
