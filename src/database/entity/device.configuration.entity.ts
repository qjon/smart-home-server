import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { LightSwitchStatus } from '../../interfaces/light/update-action.interface';

@Entity('device_configuration')
export class DeviceConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => DeviceEntity, device => device.configuration)
  device: DeviceEntity;

  @Column('tinyint')
  outlet: number;

  @Column({ default: false })
  status: boolean;

  public toJSON(): any {
    return {
      outlet: this.outlet,
      startup: this.status ? LightSwitchStatus.ON : LightSwitchStatus.OFF,
    };
  }
}
