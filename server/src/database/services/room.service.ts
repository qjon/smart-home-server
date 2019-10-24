import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';

@Injectable()
export class RoomService {

  constructor(private readonly entityManager: EntityManager) {

  }

  async create(name: string): Promise<RoomEntity> {
    const room = this.entityManager.create(RoomEntity, { name });
    return this.entityManager.save(room);
  }
}
