import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { WeatherStationsActions, WeatherStationsActionTypes } from './weather-stations-actions';

export interface WeatherStationsState {
  stations: { [key: number]: WeatherStationDto };
  ids: number[];
  data: WeatherStationDataDto[];
  compare: {[key: number]: WeatherStationDataDto[]};
}

export const emptyWeatherStationsState: WeatherStationsState = {
  stations: {},
  ids: [],
  data: [],
  compare: {},
};

export const WEATHER_STATION_STATE_NAME = 'weatherStations';

export function weatherStationReducer(state: WeatherStationsState = emptyWeatherStationsState, action: WeatherStationsActions): WeatherStationsState {
  switch (action.type) {
    case WeatherStationsActionTypes.CompareAddSuccess:
      return {
        ...state,
        compare: {
          ...state.compare,
          [action.payload.weatherStationId]: [...action.payload.data],
        },
      };
    case WeatherStationsActionTypes.LoadStationsSuccess:
      const stations: { [key: number]: WeatherStationDto } = {};
      const ids: number[] = [];

      action.payload.items.forEach((item: WeatherStationDto) => {
        const id = item.id;
        stations[id] = item;
        ids.push(id);
      });

      return {
        ...state,
        stations,
        ids,
        data: [],
      };
    case WeatherStationsActionTypes.LoadStationAggregatedData:
      return {
        ...state,
        data: [],
      };
    case WeatherStationsActionTypes.LoadStationAggregatedDataSuccess:
      return {
        ...state,
        data: action.payload.items,
      };

    case WeatherStationsActionTypes.CompareRemove:
      const compare: {[key: number]: WeatherStationDataDto[]} = {...state.compare};
      delete compare[action.payload.weatherStationId];

      return {
        ...state,
        compare: {
          ...compare
        },
      };
    case WeatherStationsActionTypes.CompareStart:
      return {
        ...state,
        compare: {
          [action.payload.weatherStationId]: [...state.data]
        }
      };

    case WeatherStationsActionTypes.CompareEnd:
      return {
        ...state,
        compare: {},
      };
    default:
      return state;
  }
}
