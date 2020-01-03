import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DeviceRepositoryService } from '../repository/device-repository.service';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceNotExistException } from '../../exceptions/device-not-exist.exception';
import { ScheduleInterface } from '../../interfaces/schedule/schedule.interface';
import { ScheduleEntity } from '../entity/schedule.entity';

@Injectable()
export class ScheduleService {

  @Inject(DeviceRepositoryService)
  private deviceRepositoryService: DeviceRepositoryService;

  constructor(private readonly entityManager: EntityManager) {

  }

  async create(scheduleData: Partial<ScheduleInterface>): Promise<ScheduleEntity> {
    const device: DeviceEntity = await this.deviceRepositoryService.getByDeviceId(scheduleData.deviceId);

    if (!device) {
      throw new DeviceNotExistException(scheduleData.deviceId);
    }

    const schedule = this.entityManager.create(ScheduleEntity, {
      device,
      action: scheduleData.action,
      day: scheduleData.day,
      time: scheduleData.time.hours + ':' + scheduleData.time.minutes + ':00',
    });

    return this.entityManager.save(schedule);
  }
}
