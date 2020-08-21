import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherStationsModule } from '@ri/weather-stations-module';
import { ObjectsModule } from '@ri/objects';

import { getMetadataArgsStorage } from 'typeorm';

import { environment } from '../environment';
import { WeatherStationsSyncController } from './controllers/weather-stations-sync.controller';

@Module({
  controllers: [
    WeatherStationsSyncController
  ],
  imports: [
    ObjectsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.database.host,
      port: parseInt(environment.database.port, 10),
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
    }),
    WeatherStationsModule
  ],
  providers: [],
})
export class WeatherStationsMicroserviceModule {}
