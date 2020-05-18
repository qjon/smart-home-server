import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('entity')
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
  uniqueId: string;
}
