import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
import { ScheduleEntity } from '../entity/schedule.entity';
import { WeatherStationEntity } from '../entity/weather-station.entity';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';

@Injectable()
export class WeatherStationDataRepositoryService {
  private logger = new Logger(this.constructor.name);

  public constructor(@InjectRepository(WeatherStationDataEntity) protected repository: Repository<WeatherStationDataEntity>) {

  }

  public fetchDataFromPeriodOfType(weatherStationId: number, from: number, to: number = null): Promise<WeatherStationDataEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .andWhere('wsd.weatherStationId = :weatherStationId', { weatherStationId })
      .andWhere('wsd.timestamp >= :from', { from })
    ;

    if (to) {
      queryBuilder.andWhere('wsd.timestamp <= :to', { to });
    }

    return queryBuilder
      .orderBy('wsd.timestamp', 'DESC')
      .getMany();
  }
}
