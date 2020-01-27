import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WEATHER_STATION_STATE_NAME, WeatherStationsState } from '@weather-stations/store/weather-stations-reducer';
import { SwitchesState } from '../../switches/store/switches-reducer';
import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';

const weatherStationFeatureSelector = createFeatureSelector<WeatherStationsState>(WEATHER_STATION_STATE_NAME);

const list = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState) => s.ids.map(id => s.stations[id]));

const data = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState) => s.data);

const current = createSelector(weatherStationFeatureSelector, (s: WeatherStationsState, params: { weatherStationId: number }): WeatherStationDto => s.stations[params.weatherStationId] || null);

export const WeatherStationsSelectors = {
  list,
  data,
  current,
};
