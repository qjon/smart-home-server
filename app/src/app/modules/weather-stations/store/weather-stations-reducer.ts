import { WeatherStationDto } from '@weather-stations/interfaces/weather-station-dto';
import { WeatherStationDataDto } from '@weather-stations/interfaces/weather-station-data-dto';
import { WeatherStationsActions, WeatherStationsActionTypes } from '@weather-stations/store/weather-stations-actions';

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
      };
    default:
      return state;
  }
}
