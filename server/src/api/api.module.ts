import { Module } from '@nestjs/common';
import { DevicesController } from './devices/devices.controller';
import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/database.module';
import { DevicesAdapterService } from './services/devices-adapter.service';
import { RoomsController } from './rooms/rooms.controller';
import { RoomController } from './rooms/room.controller';
import { ScheduleController } from './schedules/schedule.controller';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    DevicesController,
    RoomsController,
    RoomController,
    ScheduleController,
  ],
  providers: [DevicesAdapterService],
})
export class ApiModule {
}
