import { Controller, Get, Inject, Logger, Req, Request } from '@nestjs/common';
import { RoomRepositoryService } from '../../database/repository/room-repository.service';
import { RoomInterface } from '../../interfaces/room/room.interface';

@Controller('/api/rooms')
export class RoomsController {

  @Inject(RoomRepositoryService)
  private roomRepository: RoomRepositoryService;

  private logger = new Logger(this.constructor.name);

  @Get()
  public async list(@Req() req: Request): Promise<RoomInterface[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const rooms = (await this.roomRepository.getAll()).map((room) => room.toJSON());

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(rooms)}`);

    return rooms;
  }
}
