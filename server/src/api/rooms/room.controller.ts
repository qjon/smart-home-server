import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, Post, Put, Req, Request } from '@nestjs/common';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { RoomService } from '../../database/services/room.service';
import { RoomRepositoryService } from '../../database/repository/room-repository.service';
import { RoomEntity } from '../../database/entity/room.entity';
import { DeviceService } from '../../database/services/device.service';

@Controller('/api/room')
export class RoomController {

  @Inject(RoomService)
  private roomDbService: RoomService;

  @Inject(DeviceService)
  private deviceDbService: DeviceService;

  @Inject(RoomRepositoryService)
  private roomRepositoryService: RoomRepositoryService;

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

  @Put(':roomId/:actionType')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async attachOrDetach(@Req() req: Request,
                              @Body() body: { roomId: number, deviceId: string, type: string }): Promise<null> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    let room: RoomEntity = null;

    if (body.type === 'attach') {
      room = await this.roomRepositoryService.getByRoomId(body.roomId);
    }

    await this.deviceDbService.setRoom(body.deviceId, room);


    this.logger.log(`RES | API | ${req.url}`);
    return null;
  }
}
