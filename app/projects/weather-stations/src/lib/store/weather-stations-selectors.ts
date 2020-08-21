import { createFeatureSelector, createSelector } from '@ngrx/store';

import { WEATHER_STATION_STATE_NAME, WeatherStationsState } from './weather-stations-reducer';
import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { CompareWeatherStationButton } from '../interfaces/compare-weather-station-button';
import { InputChartDataSeries } from '../services/chart/weather-station-chart-data-parser.service';

const weatherStationFeatureSelector = createFeatureSelector<WeatherStationsState>(WEATHER_STATION_STATE_NAME);

const list = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState) => s.ids.map(id => s.stations[id]));

const data = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState) => s.data);

const current = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState, params: { weatherStationId: string }): WeatherStationDto => s.stations[params.weatherStationId] || null);

const compareList = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState): InputChartDataSeries[] => {
  const dataSeries: InputChartDataSeries[] = [];

  if (Boolean(s.compare)) {
    const keys: string[] = Object.keys(s.compare);
    keys.forEach((k: string) => {
      const weatherStation = s.stations[k];

      dataSeries.push({
        name: weatherStation.name,
        data: s.compare[k],
      });
    });
  }

  return dataSeries;
});

const compareButtonList = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState): CompareWeatherStationButton[] => {
  return s.ids.map((id: string) => {
    const ws: WeatherStationDto = s.stations[id];

    return {
      id,
      name: ws.name,
      isAdded: !!s.compare[id],
    };
  });
});

export const WeatherStationsSelectors = {
  compareButtonList,
  compareList,
  current,
  data,
  list,
};
