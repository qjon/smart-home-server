import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepositoryService } from './repository/device-repository.service';
import { DeviceEntity } from './entity/device.entity';
import { DeviceService } from './services/device.service';
import { DeviceConfigurationEntity } from './entity/device.configuration.entity';
import { DeviceParamsEntity } from './entity/device.params.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      DeviceConfigurationEntity,
      DeviceParamsEntity,
    ]),
  ],
  providers: [
    DeviceRepositoryService,
    DeviceService,
  ],
  exports: [
    DeviceRepositoryService,
    DeviceService,
  ],
})
export class DatabaseModule {
}
