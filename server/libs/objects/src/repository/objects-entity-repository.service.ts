import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ObjectEntity } from '../entity/object.entity';

@Injectable()
export class ObjectsEntityRepositoryService {
  public constructor(@InjectRepository(ObjectEntity) protected repository: Repository<ObjectEntity>) {

  }

  public fetchEntityObjectByIP(ip: string): Promise<ObjectEntity> {
    return this.repository
      .createQueryBuilder('e')
      .andWhere('e.ip = :ip', {ip})
      .getOne();
  }

  public fetchEntityObjectByTopic(wsTopic: string): Promise<ObjectEntity> {
    return this.repository
      .createQueryBuilder('e')
      .andWhere('e.topic = :wsTopic', {wsTopic})
      .getOne();
  }

  public fetchEntityObjectByFullSensorTopic(topic: string): Promise<ObjectEntity> {
    return this.repository
      .createQueryBuilder('e')
      .andWhere('e.topicSensorFull = :topic', {topic})
      .getOne();
  }

  public fetchEntitiesByUniqId(uniqIdList: string[]): Promise<ObjectEntity[]> {
    return this.repository
      .createQueryBuilder('e')
      .andWhere('e.uniqId  IN (:...uniqIdList)', {uniqIdList})
      .getMany();
  }

  public fetchEntityByUniqId(uniqId: string): Promise<ObjectEntity> {
    return this.repository
      .createQueryBuilder('e')
      .andWhere('e.uniqId = :uniqId', {uniqId})
      .getOne();
  }
}
