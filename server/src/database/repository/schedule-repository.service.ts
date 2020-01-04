import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
import { ScheduleEntity } from '../entity/schedule.entity';

@Injectable()
export class ScheduleRepositoryService {
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
}
