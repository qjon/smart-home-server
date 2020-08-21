import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ObjectEntity } from './entity/object.entity';
import { ObjectsEntityRepositoryService } from './repository/objects-entity-repository.service';
import { ObjectsController } from './controllers/objects.controller';
import { ObjectsEntityCreatorService } from './services/objects-entity-creator.service';

@Module({
  controllers: [
    ObjectsController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      ObjectEntity,
    ])
  ],
  providers: [
    ObjectsEntityCreatorService,
    ObjectsEntityRepositoryService,
  ],
  exports: [
    ObjectsEntityCreatorService,
    ObjectsEntityRepositoryService,
  ],
})
export class ObjectsModule {}
