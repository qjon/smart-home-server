import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { HomeAssistantSubscriberService } from './app.service';
import { HomeAssistantControllerController } from './app.controller';
import { WeatherStationsModule } from '@ri/weather-stations-module';
import { environment } from '../environment';
import { ObjectsModule } from '@ri/objects';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ObjectsModule,
    ClientsModule.register([
      {
        name: 'WS_MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          hostname: environment.mqtt.host,
          port: parseInt(environment.mqtt.port, 10),
          username: environment.mqtt.user,
          password: environment.mqtt.password,
        },
      },
    ]),
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
    WeatherStationsModule,
  ],
  providers: [HomeAssistantSubscriberService],
  exports: [HomeAssistantSubscriberService],
  controllers: [HomeAssistantControllerController],
})
export class AppModule {}
