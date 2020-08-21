import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherStationEntity } from './entity/weather-station.entity';
import { WeatherStationDataEntity } from './entity/weather-station-data.entity';
import { WeatherStationRepositoryService } from './repository/weather-station-repository.service';
import { WeatherStationDataRepositoryService } from './repository/weather-station-data-repository.service';
import { WeatherStationService } from './services/weather-station.service';
import { WeatherStationsController } from './controllers/weather-stations.controller';

@Module({
  controllers: [
    WeatherStationsController,
  ],
  exports: [
    WeatherStationRepositoryService,
    WeatherStationDataRepositoryService,
    WeatherStationService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      WeatherStationEntity,
      WeatherStationDataEntity,
    ]),
  ],
  providers: [
    WeatherStationRepositoryService,
    WeatherStationDataRepositoryService,
    WeatherStationService,
  ],
})
export class WeatherStationsModule {
}
