import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { LightSwitchStatus } from '../../interfaces/light/update-action.interface';

@Entity('device_params')
export class DeviceParamsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => DeviceEntity, device => device.params)
  device: DeviceEntity;

  @Column({ length: 50, default: '' })
  name: string;

  @Column('tinyint')
  outlet: number;

  @Column({ default: false })
  status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastStatusChange: Date;

  public toJSON(): any {
    return {
      name: this.name,
      outlet: this.outlet,
      switch: this.status ? LightSwitchStatus.ON : LightSwitchStatus.OFF,
    };
  }
}
