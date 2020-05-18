import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectEntityDto } from '../models/object-entity-dto';

@Entity('entity')
@Index('unqi_id_idx', ['uniqId'])
export class ObjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ length: 15 })
  ip: string;

  @Column({ length: 255, default: null, nullable: true })
  host: string;

  @Column({ length: 255, default: null, nullable: true })
  topic: string;

  @Column({ length: 255, default: null, nullable: true })
  topicSensorFull: string;

  @Column({ length: 255, default: null, nullable: true })
  uniqId: string;

  toJSON(): ObjectEntityDto {
    return {
      id: this.id.toString(),
      name: this.name,
      uniqId: this.uniqId,
    };
  }
}
