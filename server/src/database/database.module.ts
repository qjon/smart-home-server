import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepositoryService } from './repository/device-repository.service';
import { DeviceEntity } from './entity/device.entity';
import { DeviceService } from './services/device.service';
import { DeviceConfigurationEntity } from './entity/device.configuration.entity';
import { DeviceParamsEntity } from './entity/device.params.entity';
import { RoomService } from './services/room.service';
import { RoomEntity } from './entity/room.entity';
import { RoomRepositoryService } from './repository/room-repository.service';
import { ScheduleService } from './services/schedule.service';
import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleRepositoryService } from './repository/schedule-repository.service';
import { WeatherStationEntity } from './entity/weather-station.entity';
import { WeatherStationDataEntity } from './entity/weather-station-data.entity';
import { WeatherStationService } from './services/weather-station.service';
import { WeatherStationRepositoryService } from './repository/weather-station-repository.service';
import { WeatherStationDataRepositoryService } from './repository/weather-station-data-repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      DeviceConfigurationEntity,
      DeviceParamsEntity,
      RoomEntity,
      ScheduleEntity,
      WeatherStationEntity,
      WeatherStationDataEntity,
    ]),
  ],
  providers: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
    ScheduleRepositoryService,
    ScheduleService,
    WeatherStationDataRepositoryService,
    WeatherStationRepositoryService,
    WeatherStationService,
  ],
  exports: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
    ScheduleRepositoryService,
    ScheduleService,
    WeatherStationDataRepositoryService,
    WeatherStationRepositoryService,
    WeatherStationService,
  ],
})
export class DatabaseModule {
}
