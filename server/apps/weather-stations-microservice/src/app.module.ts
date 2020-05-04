import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { environment } from '../environment';
import { WeatherStationsModule } from '@ri/weather-stations-module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.database.host,
      port: parseInt(environment.database.port, 10),
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
    }),
    WeatherStationsModule
  ],
  controllers: [],
  providers: [],
})
export class WeatherStationsMicroserviceModule {}
