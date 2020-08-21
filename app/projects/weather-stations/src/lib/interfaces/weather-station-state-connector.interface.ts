import { Observable } from 'rxjs';

import { WeatherStationDto } from './weather-station-dto';
import { WeatherStationDataDto } from './weather-station-data-dto';
import { ChartType } from './weather-station-chart-type';
import { CompareWeatherStationButton } from './compare-weather-station-button';
import { InputChartDataSeries } from '../services/chart/weather-station-chart-data-parser.service';

export interface WeatherStationStateConnectorInterface {
  current$: Observable<WeatherStationDto>;

  data$: Observable<WeatherStationDataDto[]>;

  list$: Observable<WeatherStationDto[]>;

  compareList$: Observable<InputChartDataSeries[]>;

  compareButtonList$: Observable<CompareWeatherStationButton[]>;

  addWeatherStationToCompare(weatherStationId: string, chartType: ChartType, date: Date): void;

  endCompare(): void;

  initCompare(weatherStationId: string): void;

  loadList(): void;

  loadAggregateData(type: ChartType, year: number, month?: number, day?: number): void;

  removeWeatherStationFromCompare(weatherStationId: string): void;

  setWeatherStationId(weatherStationId: string): void;

}
