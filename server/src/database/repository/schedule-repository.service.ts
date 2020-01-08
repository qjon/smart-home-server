import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
import { ScheduleEntity } from '../entity/schedule.entity';

@Injectable()
export class ScheduleRepositoryService {
  private logger = new Logger(this.constructor.name);

  public constructor(@InjectRepository(ScheduleEntity) protected repository: Repository<ScheduleEntity>) {

  }

  public fetchByDeviceId(deviceId: number): Promise<ScheduleEntity[]> {
    return this.repository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.device', 'd')
      .andWhere('s.deviceId = :deviceId', { deviceId })
      .orderBy('s.id', 'DESC')
      .getMany();
  }

  public fetchScheduleByTimeAndDay(day: number, time: string, onlyActive: boolean = true): Promise<ScheduleEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.device', 'd')
      .leftJoinAndSelect('d.params', 'dp');

    if (onlyActive) {
      queryBuilder.andWhere('s.isActive = 1');
    }

    queryBuilder
      .andWhere('s.day & :day = :day', { day })
      .andWhere('s.time  = :time', { time });

    return queryBuilder
      .orderBy('s.id', 'DESC')
      .getMany();
  }
}
