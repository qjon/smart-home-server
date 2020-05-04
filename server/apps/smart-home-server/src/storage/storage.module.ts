import { Module } from '@nestjs/common';
import { DevicesStorageService } from './devices-storage.service';
import { ApplicationsStorageService } from './applications-storage.service';

@Module({
  providers: [
    ApplicationsStorageService,
    DevicesStorageService,
  ],
  exports: [
    ApplicationsStorageService,
    DevicesStorageService,
  ],
})
export class StorageModule {
}
