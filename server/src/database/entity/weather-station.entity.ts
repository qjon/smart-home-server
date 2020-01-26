import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WeatherStationDataEntity } from './weather-station-data.entity';

@Entity('weather_station')
export class WeatherStationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ length: 15, default: '' })
  host: string;

  @Column({ default: 80 })
  port: number;

  @OneToMany(type => WeatherStationDataEntity, data => data.weatherStation)
  data: WeatherStationDataEntity[];

  @OneToOne(type => WeatherStationDataEntity)
  @JoinColumn()
  lastData: WeatherStationDataEntity;

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
