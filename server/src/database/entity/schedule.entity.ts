import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { ScheduleInterface } from '../../interfaces/schedule/schedule.interface';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  action: boolean;

  @Column({ type: 'smallint' })
  day: number;

  @Column({ type: 'time' })
  time: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: null, nullable: true })
  lastRunAt: Date;

  @ManyToOne(type => DeviceEntity, device => device.schedules)
  device: DeviceEntity;

  toJSON(): ScheduleInterface {
    const time = this.time.split(':');
    
    return {
      id: this.id,
      deviceId: this.device.deviceId,
      action: this.action,
      day: this.day,
      time: {
        hours: parseInt(time[0], 10),
        minutes: parseInt(time[1], 10),
      },
      isActive: this.isActive,
      lastRunAt: this.lastRunAt,
    };
  }
}
