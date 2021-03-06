import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { WeatherStationEntity } from './weather-station.entity';
import { WeatherStationDataDto } from '../models/weather-station-data-dto';

@Entity('weather_station_data')
@Unique('timestamp_station', ['timestamp', 'weatherStation'])
export class WeatherStationDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer'})
  timestamp: number;

  @Column({ type: 'double', precision: 4, scale: 2 })
  temperature: number;

  @Column({ type: 'double', precision: 4, scale: 2 })
  humidity: number;

  @Column({ type: 'double', precision: 4, scale: 2, default: null })
  dewPoint: number;

  @Column({ type: 'double', precision: 6, scale: 2, default: null })
  pressure: number;

  @Column({ nullable: true })
  private weatherStationId: number;

  @ManyToOne(type => WeatherStationEntity, ws => ws.data)
  weatherStation: WeatherStationEntity;

  toJSON(): WeatherStationDataDto {
    return {
      id: this.id,
      timestamp: this.timestamp * 1000,
      humidity: this.humidity,
      temperature: this.temperature,
      dewPoint: this.dewPoint,
      pressure: this.pressure,
    };
  }
}
