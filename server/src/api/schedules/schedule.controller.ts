import { Body, Controller, Get, Inject, Logger, Param, Post, Put, Req, Request } from '@nestjs/common';
import { ScheduleInterface } from '../../interfaces/schedule/schedule.interface';
import { ScheduleService } from '../../database/services/schedule.service';
import { ScheduleRepositoryService } from '../../database/repository/schedule-repository.service';
import { ScheduleEntity } from '../../database/entity/schedule.entity';
import { DeviceRepositoryService } from '../../database/repository/device-repository.service';
import { DeviceEntity } from '../../database/entity/device.entity';
import { DeviceNotExistException } from '../../exceptions/device-not-exist.exception';

@Controller('/api/schedule/:deviceId')
export class ScheduleController {

  @Inject(ScheduleService)
  private scheduleDbService: ScheduleService;

  @Inject(ScheduleRepositoryService)
  private scheduleRepositoryService: ScheduleRepositoryService;

  @Inject(DeviceRepositoryService)
  private deviceRepositoryService: DeviceRepositoryService;

  private logger = new Logger(this.constructor.name);

  @Get()
  public async get(@Req() req: Request,
                   @Param('deviceId') deviceId: string): Promise<ScheduleInterface[]> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(deviceId)}`);

    const device: DeviceEntity = await this.deviceRepositoryService.getByDeviceId(deviceId);

    if (!device) {
      throw new DeviceNotExistException(deviceId);
    }

    const scheduleList = await this.scheduleRepositoryService.fetchByDeviceId(device.id);

    let scheduleListResponse: ScheduleInterface[] = [];

    if (scheduleList.length > 0) {
      scheduleListResponse = scheduleList.map((s: ScheduleEntity): ScheduleInterface => s.toJSON());
    }

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(scheduleListResponse)}`);

    return scheduleListResponse;
  }

  @Post()
  public async create(@Req() req: Request,
                      @Body() body: Partial<ScheduleInterface>): Promise<ScheduleInterface> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const schedule = await this.scheduleDbService.create(body);

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(schedule.toJSON())}`);
    return schedule.toJSON();
  }
}
