import { Body, Controller, Inject, Logger, Post, Req, Request } from '@nestjs/common';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { RoomService } from '../../database/services/room.service';

@Controller('/api/room')
export class RoomController {

  @Inject(RoomService)
  private roomDbService: RoomService;

  private logger = new Logger(this.constructor.name);

  @Post()
  public async create(@Req() req: Request,
                      @Body() body: { name: string }): Promise<RoomInterface> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const room = await this.roomDbService.create(
      body.name,
    );

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(room.toJSON())}`);
    return room.toJSON();
  }
}
