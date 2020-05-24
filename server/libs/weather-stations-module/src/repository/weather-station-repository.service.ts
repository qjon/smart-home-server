import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherStationEntity } from '../entity/weather-station.entity';

@Injectable()
export class WeatherStationRepositoryService {
  private logger = new Logger(this.constructor.name);

  public constructor(@InjectRepository(WeatherStationEntity) protected repository: Repository<WeatherStationEntity>) {

  }

  public fetchWeatherStationById(weatherStationId: number): Promise<WeatherStationEntity> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.id = :weatherStationId', { weatherStationId })
      .getOne();
  }

  public fetchWeatherStationBySymbolAndSensor(weatherStationSymbol: string, sensor: string = null): Promise<WeatherStationEntity> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.symbol = :weatherStationSymbol', { weatherStationSymbol })
      .andWhere('ws.sensor = :sensor', { sensor })
      .getOne();
  }

  public fetchWeatherStationByEntityIdAndSensor(entityId: number, sensor: string = null): Promise<WeatherStationEntity> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.entityId = :entityId', { entityId })
      .andWhere('ws.sensor = :sensor', { sensor })
      .getOne();
  }

  public fetchWeatherStationByHost(host: string): Promise<WeatherStationEntity> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.host = :host', { host })
      .getOne();
  }

  public fetchWeatherStationByEntityAndSensor(entityId: number, sensor: string = null): Promise<WeatherStationEntity> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.entityId = :entityId', { entityId })
      .andWhere('ws.sensor = :sensor', { sensor: sensor || '0' })
      .getOne();
  }

  public fetchAllWithLastData(): Promise<WeatherStationEntity[]> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .orderBy('ws.name')
      .getMany();
  }

  public fetchByIPWithLastData(ips: string[]): Promise<WeatherStationEntity[]> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.host  IN (:...ips)', {ips})
      .orderBy('ws.name')
      .getMany();
  }

  public fetchByEntityIdWithLastData(entityIdList: number[]): Promise<WeatherStationEntity[]> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .andWhere('ws.entityId  IN (:...entityIdList)', {entityIdList})
      .orderBy('ws.name')
      .getMany();
  }
}
