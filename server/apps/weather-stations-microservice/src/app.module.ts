import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherStationsModule } from '@ri/weather-stations-module';
import { ObjectsModule } from '@ri/objects';

import { getMetadataArgsStorage } from 'typeorm';

import { environment } from '../environment';
import { WeatherStationsSyncController } from './controllers/weather-stations-sync.controller';
import { WeatherStationsWorkersModule } from './workers/weather-stations-workers.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [
    WeatherStationsSyncController
  ],
  imports: [
    ObjectsModule,
    MailerModule.forRoot({
      transport: 'smtps://' + environment.mail.username + ':' + environment.mail.password + '@' + environment.mail.smtp,
      defaults: {
        from: environment.mail.from,
        to: environment.mail.to,
      },
    }),
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
    WeatherStationsModule,
    WeatherStationsWorkersModule,
  ],
  providers: [],
})
export class WeatherStationsMicroserviceModule {}
