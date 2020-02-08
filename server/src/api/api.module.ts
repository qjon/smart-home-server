import { Module } from '@nestjs/common';
import { DevicesController } from './devices/devices.controller';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';
import { RoomsController } from './rooms/rooms.controller';
import { RoomController } from './rooms/room.controller';
import { ScheduleController } from './schedules/schedule.controller';
import { AdapterModule } from '../adapters/adapters.module';
import { WeatherStationsController } from './weather-stations/weather-stations.controller';

@Module({
  imports: [
    AdapterModule,
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    DevicesController,
    RoomsController,
    RoomController,
    ScheduleController,
    WeatherStationsController,
  ],
  providers: [],
})
export class ApiModule {
}
