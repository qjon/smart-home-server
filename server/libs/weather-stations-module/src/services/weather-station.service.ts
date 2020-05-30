import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WeatherStationEntity } from '../entity/weather-station.entity';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import {
  WeatherStationDataInterface,
  WeatherStationSyncDataInterface,
} from '../models/weather-station-data';
import { WeatherStationDataRepositoryService } from '../repository/weather-station-data-repository.service';
import { WeatherStationRepositoryService } from '../repository/weather-station-repository.service';

export interface WeatherStationDataResponseItem {
  originalTimestamp: number;
  isValid: boolean;
  entity?: WeatherStationDataEntity;
}

@Injectable()
export class WeatherStationService {

  @Inject(WeatherStationRepositoryService)
  public weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(WeatherStationDataRepositoryService)
  public weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  public constructor(private readonly entityManager: EntityManager) {

  }

  public async createWeatherStation(entityId: number, sensor: number, name: string): Promise<WeatherStationEntity> {
    let ws: WeatherStationEntity;

    ws = await this.weatherStationRepositoryService.fetchWeatherStationByEntityIdAndSensor(entityId, sensor.toString());

    if (ws) {
      return ws;
    } else {
      ws = this.entityManager.create<WeatherStationEntity>(WeatherStationEntity, {entityId, sensor: sensor.toString(), name});

      return this.entityManager.save<WeatherStationEntity>(ws);
    }
  }

  async syncData(weatherStation: WeatherStationEntity, data: WeatherStationSyncDataInterface[]): Promise<WeatherStationDataResponseItem[]> {
    const currentTimestamp = Math.ceil(Date.now() / 1000);

    data = this.filterDuplicateTimestampData(data);

    const wrongTimestampData: WeatherStationDataResponseItem[] = this.filterWrongTimestampData(data, currentTimestamp);

    const findEntity = async (wsd: WeatherStationSyncDataInterface): Promise<WeatherStationDataResponseItem> => {
      const timestamp = wsd.time;

      const entityData: WeatherStationDataInterface = {
        humidity: parseFloat(wsd.hum),
        temperature: parseFloat(wsd.temp),
        timestamp,
      };

      const weatherStationData: WeatherStationDataEntity = await this.weatherStationDataRepositoryService.fetchDataByTimestamp(weatherStation.id, timestamp);

      if (!weatherStationData) {

        const entity: WeatherStationDataEntity = this.entityManager.create(WeatherStationDataEntity, entityData);

        entity.weatherStation = weatherStation;

        return {
          originalTimestamp: wsd.time,
          isValid: true,
          entity,
        };
      } else {
        return {
          originalTimestamp: wsd.time,
          isValid: true,
          entity: weatherStationData,
        };
      }
    };

    const findEntities = async (): Promise<WeatherStationDataResponseItem[]> => {
      return Promise.all(data.filter((item: WeatherStationSyncDataInterface) => {
        return item.time <= currentTimestamp && !isNaN(parseInt(item.hum, 10)) && !isNaN(parseInt(item.temp, 10));
      }).map(item => findEntity(item)));
    };

    const entitiesData: WeatherStationDataResponseItem[] = await findEntities();
    const entities: WeatherStationDataEntity[] = entitiesData.map((item) => item.entity);

    const lastDataEntity: WeatherStationDataEntity = entities[entities.length - 1];

    await this.entityManager.save<WeatherStationDataEntity>(entities);

    weatherStation.lastData = lastDataEntity;
    await this.entityManager.save(weatherStation);

    return [...entitiesData, ...wrongTimestampData];
  }

  private filterWrongTimestampData(data: WeatherStationSyncDataInterface[], currentTimestamp: number): WeatherStationDataResponseItem[] {
    return data
      .filter((item: WeatherStationSyncDataInterface) => {
        return item.time > currentTimestamp || isNaN(parseInt(item.hum, 10)) || isNaN(parseInt(item.temp, 10));
      })
      .map((item: WeatherStationSyncDataInterface) => {
        return {
          originalTimestamp: item.time,
          isValid: false,
        };
      });
  }

  private filterDuplicateTimestampData(data: WeatherStationSyncDataInterface[]): WeatherStationSyncDataInterface[] {
    const isTimestampUse: number[] = [];

    return data.filter((item: WeatherStationSyncDataInterface) => {
      if (isTimestampUse.indexOf(item.time) === -1) {
        isTimestampUse.push(item.time);

        return true;
      } else {
        return false;
      }
    })
  }
}
