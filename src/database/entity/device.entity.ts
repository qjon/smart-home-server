import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceConfigurationEntity } from './device.configuration.entity';
import { DeviceParamsEntity } from './device.params.entity';

@Entity('devices')
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  deviceId: string;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ length: 100 })
  apikey: string;

  @Column({ length: 50 })
  model: string;

  @Column({ default: false })
  isConnected: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastPing: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  nextPing: Date;

  @Column({ default: 0 })
  unsuccessfulPings: number;

  @OneToMany(type => DeviceConfigurationEntity, configuration => configuration.device)
  configuration: DeviceConfigurationEntity[];

  @OneToMany(type => DeviceParamsEntity, params => params.device)
  params: DeviceParamsEntity[];

  toJSON(): any {
    return {
      deviceid: this.deviceId,
      name: this.name,
      apikey: this.apikey,
      mode: this.model,
      isConnected: this.isConnected,
      params: {
        switches: this.params
          .sort((i, j) => i.outlet > j.outlet ? 1 : -1)
          .map((p) => p.toJSON()),
        configuration: this.configuration
          .sort((i, j) => i.outlet > j.outlet ? 1 : -1)
          .map((c) => c.toJSON()),
      },
    };
  }
}
