import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceRepositoryService {
  public constructor(@InjectRepository(DeviceEntity) protected deviceRepository: Repository<DeviceEntity>) {

  }

  public getAll(): Promise<DeviceEntity[]> {
    return this.deviceRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.configuration', 'c')
      .leftJoinAndSelect('d.params', 'p')
      .orderBy('d.name', 'ASC')
      .getMany();
  }

  public getByDeviceId(deviceId: string): Promise<DeviceEntity> {
    return this.deviceRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.configuration', 'c')
      .leftJoinAndSelect('d.params', 'p')
      .andWhere('d.deviceId = :deviceId', { deviceId })
      .getOne();
  }

  public getDevicesToPing(seconds = 5000): Promise<DeviceEntity[]> {
    return this.deviceRepository
      .createQueryBuilder('d')
      .andWhere('d.isConnected = false && d.unsuccessfulPings < 100')
      .orWhere('(d.isConnected = true && d.unsuccessfulPings < 100 && time_to_sec(timediff(NOW(), d.nextPing)) > d.unsuccessfulPings * :seconds)')
      .setParameter('seconds', seconds)
      .getMany()
      ;
  }
}
