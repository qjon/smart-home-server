import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { RoomInterface } from '../../interfaces/room/room.interface';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '' })
  name: string;

  @OneToMany(type => DeviceEntity, device => device.room)
  devices: DeviceEntity[];

  public toJSON(): RoomInterface {
    return {
      id: this.id,
      name: this.name,
      devices: this.devices ? this.devices.map((d) => d.deviceId) : [],
    };
  }
}
