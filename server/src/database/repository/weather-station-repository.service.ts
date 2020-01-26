import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
import { ScheduleEntity } from '../entity/schedule.entity';
import { WeatherStationEntity } from '../entity/weather-station.entity';

@Injectable()
export class WeatherStationRepositoryService {
  private logger = new Logger(this.constructor.name);

  public constructor(@InjectRepository(WeatherStationEntity) protected repository: Repository<WeatherStationEntity>) {

  }

  public fetchAllWithLastData(): Promise<WeatherStationEntity[]> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.lastData', 'wsd')
      .orderBy('ws.name')
      .getMany();
  }
}
