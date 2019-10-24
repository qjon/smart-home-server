import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';

@Injectable()
export class RoomRepositoryService {
  public constructor(@InjectRepository(RoomEntity) protected repository: Repository<RoomEntity>) {

  }

  public getAll(): Promise<RoomEntity[]> {
    return this.repository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.devices', 'd')
      .orderBy('r.name', 'ASC')
      .getMany();
  }

  public getByRoomId(roomId: number): Promise<RoomEntity> {
    return this.repository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.devices', 'd')
      .andWhere('r.id = :roomId', { roomId })
      .getOne();
  }
}
