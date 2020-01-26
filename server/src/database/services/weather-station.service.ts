import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WeatherStationEntity } from '../entity/weather-station.entity';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import { WeatherStationDataInterface } from '../../interfaces/weather-station/weather-station-data';

@Injectable()
export class WeatherStationService {

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

}
