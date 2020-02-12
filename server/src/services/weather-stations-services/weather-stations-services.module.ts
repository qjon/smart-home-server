import { HttpModule, Module } from '@nestjs/common';
import { WeatherStationsSyncService } from './weather-stations-sync.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    WeatherStationsSyncService,
  ],
  exports: [
    WeatherStationsSyncService,
  ],
})
export class WeatherStationsServicesModule {}
