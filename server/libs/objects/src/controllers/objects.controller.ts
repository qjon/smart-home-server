import { Controller, Get, Inject, Logger, Query, Req, Request } from '@nestjs/common';
import { ObjectEntity } from '../entity/object.entity';
import { ObjectEntityDto } from '../models/object-entity-dto';
import { ObjectsEntityRepositoryService } from '../repository/objects-entity-repository.service';

@Controller('/api/objects')
export class ObjectsController {
  protected logger = new Logger(ObjectsController.name);

  @Inject(ObjectsEntityRepositoryService)
  private objectsEntityRepositoryService: ObjectsEntityRepositoryService;

  @Get()
  async list(@Req() req: Request, @Query('uniqId') uniqId: string = ''): Promise<ObjectEntityDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response: ObjectEntityDto[] = await this.objectsEntityRepositoryService.fetchEntitiesByUniqId(uniqId.split(';'))
      .then((data: ObjectEntity[]) => {
        return data.map((objectEntity: ObjectEntity) => objectEntity.toJSON());
      });

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(response)}`);
    return response;
  }
}
