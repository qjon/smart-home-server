import { WeatherStationDto } from '../interfaces/weather-station-dto';
import { WeatherStationDataDto } from '../interfaces/weather-station-data-dto';
import { WeatherStationsActions, WeatherStationsActionTypes } from './weather-stations-actions';

export interface WeatherStationsState {
  stations: { [key: number]: WeatherStationDto },
  ids: number[];
  data: WeatherStationDataDto[];
}

export const emptyWeatherStationsState: WeatherStationsState = {
  stations: {},
  ids: [],
  data: [],
};

export const WEATHER_STATION_STATE_NAME = 'weatherStations';

export function weatherStationReducer(state: WeatherStationsState = emptyWeatherStationsState, action: WeatherStationsActions): WeatherStationsState {
  switch (action.type) {
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
    case WeatherStationsActionTypes.LoadStationsAggregateDataForDay:
    case WeatherStationsActionTypes.LoadStationsAggregateDataForWeek:
    case WeatherStationsActionTypes.LoadStationsDataForMonth:
    case WeatherStationsActionTypes.LoadStationsDataForYear:
      return {
        ...state,
        data: [],
      };
    case WeatherStationsActionTypes.LoadStationsAggregateDataForDaySuccess:
    case WeatherStationsActionTypes.LoadStationsAggregateDataForWeekSuccess:
    case WeatherStationsActionTypes.LoadStationsDataForMonthSuccess:
    case WeatherStationsActionTypes.LoadStationsDataForYearSuccess:
      return {
        ...state,
        data: action.payload.items,
      };
    case WeatherStationsActionTypes.SyncStationsDataSuccess:
      return {
        ...state,
        stations: {
          ...state.stations,
          [action.payload.weatherStationId]: {
            ...state.stations[action.payload.weatherStationId],
            ...action.payload.data
          }
        }
      }
    default:
      return state;
  }
}
