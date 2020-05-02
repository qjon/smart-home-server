import { Module } from '@nestjs/common';
import { HomeAssistantSubscriberService } from './home-assistant-subscriber.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HomeAssistantControllerController } from './home-assistant-controller.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HOME_ASSISTANT',
        transport: Transport.MQTT,
        options: {
          hostname: '192.168.100.3',
          port: 1883,
          protocol: 'mqtt',
          username: 'subscriber',
          password: 'mqttsubscriber',
        },
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.database.host,
      port: 3306,
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  providers: [HomeAssistantSubscriberService],
  exports: [HomeAssistantSubscriberService],
  controllers: [HomeAssistantControllerController],
})
export class HomeAssistantModule {

}
