import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { ScheduleRepositoryService } from '../database/repository/schedule-repository.service';
import { ScheduleEntity } from '../database/entity/schedule.entity';
import { DevicesAdapterService } from '../adapters/devices-adapter.service';
import { DeviceEntity } from '../database/entity/device.entity';
import { LightSwitch, LightSwitchStatus } from '../interfaces/light/update-action.interface';
import { DeviceParamsEntity } from '../database/entity/device.params.entity';
import { interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ScheduleService } from '../database/services/schedule.service';
import { WeatherStationService } from '../database/services/weather-station.service';
import { WeatherStationRepositoryService } from '../database/repository/weather-station-repository.service';
import { WeatherStationEntity } from '../database/entity/weather-station.entity';
import { WeatherStationSyncResponse } from '../interfaces/weather-station/weather-station-sync-response';
import { AxiosResponse } from 'axios';
import { WeatherStationDataInterface } from '../interfaces/weather-station/weather-station-data';

@Injectable()
export class WeatherStationSyncService implements WorkerInterface {

  @Inject(WeatherStationService)
  protected weatherStationService: WeatherStationService;

  @Inject(WeatherStationRepositoryService)
  protected weatherStationRepositoryService: WeatherStationRepositoryService;

  protected logger = new Logger(WeatherStationSyncService.name);

  protected interval: NodeJS.Timeout;

  constructor(private readonly httpService: HttpService) {
  }

  public execute(): void {
    interval(30 * 60 * 1000)
      .subscribe((seconds) => {
        this.runSchedule();
      });
  }

  public stop(): void {
    this.interval.unref();
  }

  async runSchedule(): Promise<any> {
    const weatherStations: WeatherStationEntity[] = await this.weatherStationRepositoryService.fetchAllWithLastData();

    weatherStations.forEach((ws: WeatherStationEntity) => {
      this.logger.debug('Weather station sync: ' + ws.name);
      this.getDataFromWeatherStation(ws)
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
          filter((data: WeatherStationDataInterface[]) => data.length > 0),
        )
        .subscribe((data: WeatherStationDataInterface[]) => {
          this.weatherStationService.importData(ws, data);
        });
    });
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
        timestamp: parseInt(rowData[0], 10),
        temperature: parseFloat(rowData[1]),
        humidity: parseFloat(rowData[2]),
      };
    });
  }
}
