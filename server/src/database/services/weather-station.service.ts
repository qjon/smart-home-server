import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WeatherStationEntity } from '../entity/weather-station.entity';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import {
  WeatherStationDataInterface,
  WeatherStationSyncDataInterface,
} from '../../interfaces/weather-station/weather-station-data';
import { WeatherStationDataRepositoryService } from '../repository/weather-station-data-repository.service';

export interface WeatherStationDataResponseItem {
  originalTimestamp: number;
  isValid: boolean;
  entity?: WeatherStationDataEntity;
}

@Injectable()
export class WeatherStationService {

  @Inject(WeatherStationDataRepositoryService)
  public weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  public constructor(private readonly entityManager: EntityManager) {

  }

  async syncData(weatherStation: WeatherStationEntity, data: WeatherStationSyncDataInterface[]): Promise<WeatherStationDataResponseItem[]> {
    const currentTimestamp = Math.ceil(Date.now() / 1000);

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
}
