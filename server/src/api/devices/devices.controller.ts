import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseFilters,
} from '@nestjs/common';
import { DevicesStorageService } from '../../storage/devices-storage.service';
import { DeviceInterface } from '../../interfaces/storage/device-interface';
import { DeviceChangeSettingsDto, LightSwitch } from '../../interfaces/light/update-action.interface';
import { DeviceService } from '../../database/services/device.service';
import { DeviceRepositoryService } from '../../database/repository/device-repository.service';
import { ApiExceptionFilters } from '../filters/api.filters';
import { DeviceAdapterInterface } from '../../adapters/device-adapter.interface';
import { DevicesAdapterService } from '../../adapters/devices-adapter.service';

@Controller('/api/devices')
@UseFilters(new ApiExceptionFilters())
export class DevicesController {

  protected logger = new Logger(DevicesController.name);

  @Inject(DeviceService)
  protected deviceDbService: DeviceService;

  @Inject(DeviceRepositoryService)
  protected deviceRepositoryService: DeviceRepositoryService;

  @Inject(DevicesAdapterService)
  private deviceAdapter: DeviceAdapterInterface;

  public constructor(protected storage: DevicesStorageService,
                     protected deviceService: DeviceService) {

  }

  @Post()
  async create(@Req() req: Request,
               @Body() body: { deviceId: string, apiKey: string, name: string }): Promise<DeviceInterface> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const device = await this.deviceDbService.create(
      body.deviceId,
      body.name,
      body.apiKey,
      'single',
    );

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(device.toJSON())}`);
    return device.toJSON();
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

    const device = await this.deviceDbService.updateDevice(deviceId, <LightSwitch[]>body.switches, null);
    this.deviceAdapter.updateSwitches({
      apiKey: device.apikey,
      deviceId,
      host: device.host,
      port: device.port,
      method: 'POST',
      path: device.isSingleSwitch ? '/zeroconf/switch' : '/zeroconf/switches',
      data: device.isSingleSwitch ? { switch: body.switches[0].switch } : body,
    });
  }

  @Put(':deviceId/settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  async settings(@Req() req: Request,
                 @Param('deviceId') deviceId: string,
                 @Body() body: DeviceChangeSettingsDto): Promise<any> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    await this.deviceDbService.updateDeviceSettings(deviceId, body);
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
