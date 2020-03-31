import { HttpService, Injectable, Logger } from '@nestjs/common';
import { WeatherStationEntity } from '../../database/entity/weather-station.entity';
import { filter, map, tap } from 'rxjs/operators';
import { WeatherStationSyncResponse } from '../../interfaces/weather-station/weather-station-sync-response';
import { WeatherStationDataInterface } from '../../interfaces/weather-station/weather-station-data';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class WeatherStationsSyncService {
  private logger = new Logger(WeatherStationsSyncService.name);

  constructor(private readonly httpService: HttpService) {
  }

  public import(ws: WeatherStationEntity): Observable<WeatherStationDataInterface[]> {
    this.logger.debug('Weather station sync: ' + ws.name);

    return this.getDataFromWeatherStation(ws)
      .pipe(
        filter((data: WeatherStationSyncResponse) => data.error === 0),
        map((data: WeatherStationSyncResponse): WeatherStationDataInterface[] => {
          const wsData: WeatherStationDataInterface[] = this.parseData(data.data.toSync);

          if (ws.lastData) {
            return wsData.filter((row: WeatherStationDataInterface) => row.timestamp > ws.lastData.timestamp);
          } else {
            return wsData;
          }
        }),
        map((data: WeatherStationDataInterface[]) => {
          let last: number = null;

          const now = Date.now() / 1000;

          return data
            .filter((wsd: WeatherStationDataInterface) => {
              // filter duplicated results from the same second or timestamp errors (when grater than now)
              const result: boolean = (!last || (!!last && last !== wsd.timestamp)) && wsd.timestamp <= now;
              last = wsd.timestamp;

              return result;
            });
        }),
        filter((data: WeatherStationDataInterface[]) => data.length > 0),
      );
  }

  private getDataFromWeatherStation(ws: WeatherStationEntity): Observable<WeatherStationSyncResponse> {
    return this.httpService.get(`http://${ws.host}:${ws.port}/api/file/sync`)
      .pipe(
        map((data: AxiosResponse<WeatherStationSyncResponse>) => data.data),
      );
  }

  private parseData(data: string[]): WeatherStationDataInterface[] {
    return data.map((row: string): WeatherStationDataInterface => {
      const rowData = row.split('|');

      return {
        timestamp: parseInt(rowData[0], 10) - 3600,
        temperature: parseFloat(rowData[1]),
        humidity: parseFloat(rowData[2]),
      };
    });
  }
}
