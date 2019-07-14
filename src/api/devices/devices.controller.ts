import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Put,
  Req,
  Request,
  UseFilters,
} from '@nestjs/common';
import { DevicesStorageService } from '../../storage/devices-storage.service';
import { DeviceInterface } from '../../interfaces/storage/device-interface';
import { LightSwitch } from '../../interfaces/light/update-action.interface';
import { DeviceService } from '../../database/services/device.service';
import { DeviceRepositoryService } from '../../database/repository/device-repository.service';
import { DeviceNotConnectedException } from '../../exceptions/device-not-connected.exception';
import { ApiExceptionFilters } from '../filters/api.filters';

@Controller('/api/devices')
@UseFilters(new ApiExceptionFilters())
export class DevicesController {

  protected logger = new Logger(DevicesController.name);

  @Inject(DeviceService)
  protected deviceDbService: DeviceService;

  @Inject(DeviceRepositoryService)
  protected deviceRepositoryService: DeviceRepositoryService;

  public constructor(protected storage: DevicesStorageService,
                     protected deviceService: DeviceService) {

  }

  @Get()
  async list(@Req() req: Request): Promise<DeviceInterface[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.deviceRepositoryService.getAll()
      .then((data) => {
        return data.map(d => d.toJSON());
      });

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(response)}`);
    return response;
  }

  @Put(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async status(@Req() req: Request,
               @Param('deviceId') deviceId: string,
               @Body() body: { switches: LightSwitch[] }): Promise<any> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const sequence = Date.now().toString();

    const device = await this.deviceDbService.updateDevice(deviceId, <LightSwitch[]>body.switches, null);
    const deviceConnection = this.storage.getOne(deviceId);

    if (!deviceConnection) {
      throw new DeviceNotConnectedException(deviceId);
    }

    const value = {
      apikey: device.apikey,
      action: 'update',
      deviceid: deviceId,
      params: body,
      userAgent: 'app',
      sequence,
      ts: 0,
      from: 'app',
    };

    deviceConnection.sendMessages.set(sequence, value);

    deviceConnection.conn.sendText(JSON.stringify(value));

    this.logger.log(`SEND | WS | ${JSON.stringify(value)}`);
  }

  @Put(':deviceId/rename')
  @HttpCode(HttpStatus.NO_CONTENT)
  public rename(@Req() req: Request,
                @Param('deviceId') deviceId: string,
                @Body() body: { name: string }): void {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    this.deviceService.updateDeviceName(deviceId, body.name);
    this.logger.log(`RES | API | ${req.url} | EMPTY`);
  }

  @Put(':deviceId/outlet/:outlet/rename')
  @HttpCode(HttpStatus.NO_CONTENT)
  public renameDeviceSwitchName(@Req() req: Request,
                                @Param('deviceId') deviceId: string,
                                @Param('outlet') outlet: string,
                                @Body() body: { name: string }): void {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    this.deviceService.updateDeviceOutletName(deviceId, parseInt(outlet, 10), body.name);
    this.logger.log(`RES | API | ${req.url} | EMPTY`);
  }

  @Get(':deviceId/timer')
  async timer(@Req() req: Request,
              @Param('deviceId') deviceId: string): Promise<any> {
    this.logger.log(`REQ | API | ${req.url}`);

    const deviceConnection = this.storage.getOne(deviceId);
    const sequence = Date.now().toString();

    const device = await this.deviceRepositoryService.getByDeviceId(deviceId);

    const value = {
      apikey: device.apikey,
      action: 'update',
      deviceid: deviceId,
      timers: [
        {
          // enabled: true,
          type: 'repeat',
          at: '* * * * * 5',
          do: {
            switches: [
              {
                switch: 'on',
                outlet: 1,
              },
            ],
          },
        },
      ],
      userAgent: 'app',
      sequence,
      ts: 0,
      from: 'app',
    };

    deviceConnection.sendMessages.set(sequence, value);

    deviceConnection.conn.sendText(JSON.stringify(value));

    this.logger.log(`SEND | WS | ${JSON.stringify(value)}`);
  }

  @Get(':deviceId/name/:name')
  public setName(@Req() req: Request,
                 @Param('deviceId') deviceId: string,
                 @Param('name') name: string): void {
    this.logger.log(`REQ | API | ${req.url}`);

    this.deviceService.updateDeviceName(deviceId, name);

    this.logger.log(`SEND | WS | ${JSON.stringify({})}`);
  }
}
