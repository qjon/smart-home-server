import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from './worker.interface';
import { interval } from 'rxjs';
import { WeatherStationRepositoryService } from '../database/repository/weather-station-repository.service';
import { WeatherStationEntity } from '../database/entity/weather-station.entity';
import { WeatherStationsSyncService } from '../services/weather-stations-services/weather-stations-sync.service';
import { WeatherStationDataInterface } from '../interfaces/weather-station/weather-station-data';
import { WeatherStationService } from '../database/services/weather-station.service';

@Injectable()
export class WeatherStationSyncWorkerService implements WorkerInterface {

  @Inject(WeatherStationsSyncService)
  protected weatherStationsSyncService: WeatherStationsSyncService;

  @Inject(WeatherStationService)
  protected weatherStationService: WeatherStationService;

  @Inject(WeatherStationRepositoryService)
  protected weatherStationRepositoryService: WeatherStationRepositoryService;

  protected logger = new Logger(WeatherStationSyncWorkerService.name);

  protected interval: NodeJS.Timeout;

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
      this.weatherStationsSyncService.import(ws)
        .subscribe((data: WeatherStationDataInterface[]) => {
          this.weatherStationService.importData(ws, data);
        });
    });
  }
}
