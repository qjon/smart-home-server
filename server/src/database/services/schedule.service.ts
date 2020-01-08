import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DeviceRepositoryService } from '../repository/device-repository.service';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceNotExistException } from '../../exceptions/device-not-exist.exception';
import { ScheduleInterface } from '../../interfaces/schedule/schedule.interface';
import { ScheduleEntity } from '../entity/schedule.entity';
import { ScheduleRepositoryService } from '../repository/schedule-repository.service';
import { ScheduleNotExistException } from '../../exceptions/schedule-not-exist.exception';

@Injectable()
export class ScheduleService {

  @Inject(DeviceRepositoryService)
  private deviceRepositoryService: DeviceRepositoryService;

  @Inject(ScheduleRepositoryService)
  private scheduleRepositoryService: ScheduleRepositoryService;

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

  async updateActiveStatus(deviceId: string, scheduleId: number, isActive: boolean): Promise<ScheduleEntity> {
    const schedule: ScheduleEntity = await this.scheduleRepositoryService.fetchByScheduleIdWithDevice(scheduleId);

    if (!schedule) {
      throw new ScheduleNotExistException(scheduleId.toString());
    }

    if (deviceId !== schedule.device.deviceId) {
      throw new ScheduleNotExistException(scheduleId.toString());
    }

    schedule.isActive = isActive;

    return this.entityManager.save(schedule);
  }

  async remove(deviceId: string, scheduleId: number): Promise<boolean> {
    const schedule: ScheduleEntity = await this.scheduleRepositoryService.fetchByScheduleIdWithDevice(scheduleId);

    if (!schedule) {
      throw new ScheduleNotExistException(scheduleId.toString());
    }

    if (deviceId !== schedule.device.deviceId) {
      throw new ScheduleNotExistException(scheduleId.toString());
    }

    return this.entityManager.remove(schedule)
      .then(() => true, () => false);
  }
}
