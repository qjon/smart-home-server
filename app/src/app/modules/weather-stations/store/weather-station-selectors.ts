import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WEATHER_STATION_STATE_NAME, WeatherStationsState } from '@weather-stations/store/weather-stations-reducer';

const weatherStationFeatureSelector = createFeatureSelector<WeatherStationsState>(WEATHER_STATION_STATE_NAME);

const list = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState) => s.ids.map(id => s.stations[id]));

export const WeatherStationSelectors = {
  list,
};
