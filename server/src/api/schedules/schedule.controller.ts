import { Body, Controller, Inject, Logger, Post, Put, Req, Request } from '@nestjs/common';
import { ScheduleInterface } from '../../interfaces/schedule/schedule.interface';
import { ScheduleService } from '../../database/services/schedule.service';

@Controller('/api/schedule/:deviceId')
export class ScheduleController {

  @Inject(ScheduleService)
  private scheduleDbService: ScheduleService;

  private logger = new Logger(this.constructor.name);

  @Post()
  public async create(@Req() req: Request,
                      @Body() body: Partial<ScheduleInterface>): Promise<ScheduleInterface> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const schedule = await this.scheduleDbService.create(body);

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(schedule.toJSON())}`);
    return schedule.toJSON();
  }
}
