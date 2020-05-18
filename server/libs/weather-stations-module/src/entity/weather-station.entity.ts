import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WeatherStationDataEntity } from './weather-station-data.entity';
import { WeatherStationDto } from '../models/weather-station-dto';

@Entity('weather_station')
export class WeatherStationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ length: 15, default: '' })
  host: string;

  @Column({ length: 6, default: '' })
  symbol: string;

  @Column({ length: 255, default: '' })
  topic: string;

  @Column({ default: 0 })
  sensor: number;

  @OneToMany(type => WeatherStationDataEntity, data => data.weatherStation)
  data: WeatherStationDataEntity[];

  @OneToOne(type => WeatherStationDataEntity)
  @JoinColumn()
  lastData: WeatherStationDataEntity;

  toJSON(): WeatherStationDto {
    return {
      id: this.id,
      name: this.name,
      humidity: this.lastData ? this.lastData.humidity : null,
      temperature: this.lastData ? this.lastData.temperature : null,
      timestamp: this.lastData ? this.lastData.timestamp * 1000 : null,
    };
  }
}
