import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import {
  WeatherStationDayAvgDataDto,
  WeatherStationMonthAvgDataDto,
  WeatherStationYearAvgDataDto,
} from '../../interfaces/weather-station/weather-station-data-dto';

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
      .orderBy('wsd.timestamp', 'ASC')
      .getMany();
  }

  public fetchDataFromMonth(weatherStationId: number, year: number, month: number): Promise<WeatherStationMonthAvgDataDto[]> {
    const from = new Date(year, month, 1, 0, 0, 0).getTime() / 1000;
    const to = new Date((month === 11) ? year + 1 : year, (month === 11) ? 0 : month + 1, 1, 0, 0, 0).getTime() / 1000;

    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('DAY(FROM_UNIXTIME(wsd.timestamp))', 'day');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'day')
      .getRawMany();
  }

  public fetchDataFromDay(weatherStationId: number, year: number, month: number, day: number): Promise<WeatherStationDayAvgDataDto[]> {
    const from: number = (new Date(year, month, day, 0, 0, 0)).getTime() / 1000;
    const to: number = (new Date(year, month, day, 23, 59, 59)).getTime() / 1000;
    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('HOUR(FROM_UNIXTIME(wsd.timestamp))', 'hour');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'hour')
      .getRawMany();
  }

  public fetchDataFromWeek(weatherStationId: number, from: number, to: number): Promise<WeatherStationMonthAvgDataDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('DAY(FROM_UNIXTIME(wsd.timestamp))', 'day');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'day')
      .getRawMany();
  }

  public fetchDataFromYear(weatherStationId: number, year: number): Promise<WeatherStationYearAvgDataDto[]> {
    const from = new Date(year, 0, 1, 0, 0, 0).getTime() / 1000;
    const to = new Date(year + 1, 0, 1, 0, 0, 0).getTime() / 1000;
    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('MONTH(FROM_UNIXTIME(wsd.timestamp))', 'month');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'month')
      .getRawMany();
  }

  private updateQueryBuilder(queryBuilder: SelectQueryBuilder<WeatherStationDataEntity>,
                             weatherStationId: number,
                             from: number,
                             to: number,
                             groupBy: string): SelectQueryBuilder<WeatherStationDataEntity> {
    return queryBuilder
      .addSelect('AVG(humidity)', 'avgHumidity')
      .addSelect('AVG(temperature)', 'avgTemperature')
      .andWhere('wsd.weatherStationId = :weatherStationId', { weatherStationId })
      .andWhere('wsd.timestamp >= :from', { from })
      .andWhere('wsd.timestamp < :to', { to })
      .groupBy(groupBy)
      .orderBy(groupBy, 'ASC');
  }
}
