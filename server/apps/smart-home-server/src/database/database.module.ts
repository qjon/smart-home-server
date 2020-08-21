import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepositoryService } from './repository/device-repository.service';
import { DeviceEntity } from './entity/device.entity';
import { DeviceService } from './services/device.service';
import { DeviceConfigurationEntity } from './entity/device.configuration.entity';
import { DeviceParamsEntity } from './entity/device.params.entity';
import { RoomService } from './services/room.service';
import { RoomEntity } from './entity/room.entity';
import { RoomRepositoryService } from './repository/room-repository.service';
import { ScheduleService } from './services/schedule.service';
import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleRepositoryService } from './repository/schedule-repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceConfigurationEntity,
      DeviceEntity,
      DeviceParamsEntity,
      RoomEntity,
      ScheduleEntity,
    ]),
  ],
  providers: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
    ScheduleRepositoryService,
    ScheduleService,
  ],
  exports: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
    ScheduleRepositoryService,
    ScheduleService,
  ],
})
export class DatabaseModule {
}
