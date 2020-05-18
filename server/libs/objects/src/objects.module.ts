import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ObjectEntity } from './entity/object.entity';
import { ObjectsEntityRepositoryService } from './repository/objects-entity-repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ObjectEntity,
    ])
  ],
  providers: [
    ObjectsEntityRepositoryService,
  ],
  exports: [
    ObjectsEntityRepositoryService,
  ],
})
export class ObjectsModule {}
