import { Inject, Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { ObjectEntityDataDto } from '../models/object-entity-data-dto';
import { ObjectEntity } from '../entity/object.entity';

@Injectable()
export class ObjectsEntityCreatorService {
  @Inject(EntityManager)
  private entityManager: EntityManager;

  public create(data: ObjectEntityDataDto): Promise<ObjectEntity> {
    const entity: ObjectEntity = this.entityManager.create<ObjectEntity>(ObjectEntity, data);

    return this.entityManager.save<ObjectEntity>(entity);
  }
}
