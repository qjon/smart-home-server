import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import {
  WeatherStationDayAvgDataDto,
  WeatherStationMonthAvgDataDto,
  WeatherStationYearAvgDataDto,
} from '../models/weather-station-data-dto';

@Injectable()
export class WeatherStationDataRepositoryService {
  private logger = new Logger(this.constructor.name);

  private timezone = '+01:00';

  public constructor(@InjectRepository(WeatherStationDataEntity) protected repository: Repository<WeatherStationDataEntity>) {

  }

  public fetchDataByTimestamp(weatherStationId: number, time: number) {
    return this.repository
      .createQueryBuilder('wsd')
      .andWhere('wsd.weatherStationId = :weatherStationId', { weatherStationId })
      .andWhere('wsd.timestamp = :time', { time })
      .getOne();
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
    const fromDate = new Date(year, month, 1, 0, 0, 0);
    const toDate = new Date(year, month, 1, 0, 0, 0);

    toDate.setMonth(toDate.getMonth() + 1);

    const from = fromDate.getTime() / 1000;
    const to = toDate.getTime() / 1000;

    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('DAY(FROM_UNIXTIME(wsd.timestamp))', 'day');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'day')
      .getRawMany();
  }

  public fetchDataFromDay(weatherStationId: number, year: number, month: number, day: number): Promise<WeatherStationDayAvgDataDto[]> {
    const fromDate = new Date(year, month, day, 0, 0, 0);
    const toDate = new Date(year, month, day, 0, 0, 0);

    toDate.setDate(toDate.getDate() + 1);

    const from = fromDate.getTime() / 1000;
    const to = toDate.getTime() / 1000;

    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('HOUR(FROM_UNIXTIME(wsd.timestamp))', 'hour');

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'hour')
      .getRawMany();
  }

  public fetchDataFromWeek(weatherStationId: number, from: number, to: number): Promise<WeatherStationMonthAvgDataDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('wsd')
      .select('DAY(FROM_UNIXTIME(wsd.timestamp))', 'day')
      .addSelect('MONTH(FROM_UNIXTIME(wsd.timestamp))', 'month')
      .groupBy('month')
      .orderBy('month', 'ASC')
    ;

    return this.updateQueryBuilder(queryBuilder, weatherStationId, from, to, 'day')
      .getRawMany();
  }

  public fetchDataFromYear(weatherStationId: number, year: number): Promise<WeatherStationYearAvgDataDto[]> {
    const fromDate = new Date(year, 0, 1, 0, 0, 0);
    const toDate = new Date(year, 0, 1, 0, 0, 0);

    toDate.setFullYear(toDate.getFullYear() + 1);

    const from = fromDate.getTime() / 1000;
    const to = toDate.getTime() / 1000;

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
      .addSelect('AVG(dewPoint)', 'avgDewPoint')
      .addSelect('AVG(pressure)', 'avgPressure')
      .andWhere('wsd.weatherStationId = :weatherStationId', { weatherStationId })
      .andWhere('wsd.timestamp >= :from', { from })
      .andWhere('wsd.timestamp < :to', { to })
      .addGroupBy(groupBy)
      .addOrderBy(groupBy, 'ASC');
  }
}
