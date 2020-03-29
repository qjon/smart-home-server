import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WeatherStationEntity } from '../entity/weather-station.entity';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import {
  WeatherStationDataInterface,
  WeatherStationSyncDataInterface,
} from '../../interfaces/weather-station/weather-station-data';
import { WeatherStationDataRepositoryService } from '../repository/weather-station-data-repository.service';

@Injectable()
export class WeatherStationService {

  @Inject(WeatherStationDataRepositoryService)
  public weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  public constructor(private readonly entityManager: EntityManager) {

  }

  async importData(weatherStation: WeatherStationEntity, data: WeatherStationDataInterface[]): Promise<WeatherStationDataEntity[]> {
    const entities: WeatherStationDataEntity[] = data.map((wsd: WeatherStationDataInterface) => {
      const entity: WeatherStationDataEntity = this.entityManager.create(WeatherStationDataEntity, wsd);

      entity.weatherStation = weatherStation;

      return entity;
    });

    const lastDataEntity: WeatherStationDataEntity = entities[entities.length - 1];

    await this.entityManager.save<WeatherStationDataEntity>(entities);

    weatherStation.lastData = lastDataEntity;
    await this.entityManager.save(weatherStation);

    return entities;
  }

  async syncData(weatherStation: WeatherStationEntity, data: WeatherStationSyncDataInterface[]): Promise<WeatherStationDataEntity[]> {
    const findEntity = async (wsd: WeatherStationSyncDataInterface) => {
      const entityData: WeatherStationDataInterface = {
        humidity: parseFloat(wsd.hum),
        temperature: parseFloat(wsd.temp),
        timestamp: wsd.time,
      };

      const weatherStationData: WeatherStationDataEntity = await this.weatherStationDataRepositoryService.fetchDataByTimestamp(weatherStation.id, entityData.timestamp);

      if (!weatherStationData) {

        const entity: WeatherStationDataEntity = this.entityManager.create(WeatherStationDataEntity, entityData);

        entity.weatherStation = weatherStation;

        return entity;
      } else {
        return weatherStationData;
      }
    };

    const findEntities = async () => {
      return Promise.all(data.map(item => findEntity(item)));
    };

    const entities: WeatherStationDataEntity[] = await findEntities();

    const lastDataEntity: WeatherStationDataEntity = entities[entities.length - 1];

    await this.entityManager.save<WeatherStationDataEntity>(entities);

    weatherStation.lastData = lastDataEntity;
    await this.entityManager.save(weatherStation);

    return entities;
  }
}
