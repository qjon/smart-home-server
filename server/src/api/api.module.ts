import { Module } from '@nestjs/common';
import { DevicesController } from './devices/devices.controller';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';
import { RoomsController } from './rooms/rooms.controller';
import { RoomController } from './rooms/room.controller';
import { ScheduleController } from './schedules/schedule.controller';
import { AdapterModule } from '../adapters/adapters.module';

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
  ],
  providers: [],
})
export class ApiModule {
}
