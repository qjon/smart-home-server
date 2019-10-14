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

  @Column({ length: 50, default: '' })
  model: string;

  @Column({ default: true })
  isSingleSwitch: boolean;

  @Column({ length: 15, default: '' })
  host: string;

  @Column({ default: 0 })
  port: number;

  @Column({ default: false })
  isConnected: boolean;

  @Column({ type: 'timestamp', default: null })
  lastStatusChangeTimestamp: Date;

  @OneToMany(type => DeviceConfigurationEntity, configuration => configuration.device)
  configuration: DeviceConfigurationEntity[];

  @OneToMany(type => DeviceParamsEntity, params => params.device)
  params: DeviceParamsEntity[];

  toJSON(): any {
    return {
      deviceid: this.deviceId,
      name: this.name,
      apiKey: this.apikey,
      model: this.model,
      isConnected: this.isConnected,
      isSingleSwitch: this.isSingleSwitch,
      lastStatusChangeTimestamp: this.lastStatusChangeTimestamp,
      params: {
        switches: !this.params ? [] : this.params
          .sort((i, j) => i.outlet > j.outlet ? 1 : -1)
          .map((p) => p.toJSON()),
        configuration: !this.configuration ? [] : this.configuration
          .sort((i, j) => i.outlet > j.outlet ? 1 : -1)
          .map((c) => c.toJSON()),
      },
    };
  }
}
