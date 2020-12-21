import { Module } from '@nestjs/common';
import { WeatherStationNoResultWorkerService } from './weather-station-no-result-worker.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { WeatherStationsModule } from '@ri/weather-stations-module';
import { ObjectsModule } from '@ri/objects';

@Module({
  imports: [
    MailerModule,
    WeatherStationsModule,
    ObjectsModule,
  ],
  providers: [
    WeatherStationNoResultWorkerService,
  ]
})
export class WeatherStationsWorkersModule {
  public constructor(weatherStationNoResultWorkerService: WeatherStationNoResultWorkerService) {
    weatherStationNoResultWorkerService.execute();
  }
}
