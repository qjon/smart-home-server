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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      DeviceConfigurationEntity,
      DeviceParamsEntity,
      RoomEntity,
    ]),
  ],
  providers: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
  ],
  exports: [
    DeviceRepositoryService,
    DeviceService,
    RoomRepositoryService,
    RoomService,
  ],
})
export class DatabaseModule {
}
