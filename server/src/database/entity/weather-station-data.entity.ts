import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { WeatherStationEntity } from './weather-station.entity';

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

  @Column({ nullable: true })
  private weatherStationId: number;

  @ManyToOne(type => WeatherStationEntity, ws => ws.data)
  weatherStation: WeatherStationEntity;

  toJSON(): any {
    return {
      timestamp: this.timestamp,
      humidity: this.humidity,
      temperature: this.temperature,
    };
  }
}
