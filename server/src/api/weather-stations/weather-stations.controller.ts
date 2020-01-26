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
  Put, Query,
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
import { WeatherStationRepositoryService } from '../../database/repository/weather-station-repository.service';
import { WeatherStationDto } from '../../interfaces/weather-station/weather-station-dto';
import { WeatherStationDataRepositoryService } from '../../database/repository/weather-station-data-repository.service';
import { WeatherStationDataDto } from '../../interfaces/weather-station/weather-station-data-dto';
import { WeatherStationDataEntity } from '../../database/entity/weather-station-data.entity';

@Controller('/api/weather-stations')
@UseFilters(new ApiExceptionFilters())
export class WeatherStationsController {

  protected logger = new Logger(WeatherStationsController.name);

  @Inject(WeatherStationRepositoryService)
  protected weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(WeatherStationDataRepositoryService)
  protected weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  @Get()
  async list(@Req() req: Request): Promise<WeatherStationDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.weatherStationRepositoryService.fetchAllWithLastData()
      .then((data) => {
        return data.map(ws => ws.toJSON());
      });

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(response)}`);
    return response;
  }

  @Get(':id/data')
  async data(@Req() req: Request,
             @Param('id') weatherStationId: number,
             @Query('from') from: number,
             @Query('to') to: number = null): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.weatherStationDataRepositoryService.fetchDataFromPeriodOfType(weatherStationId, from, to)
      .then((data: WeatherStationDataEntity[]) => {
        return data.map((wsd) => wsd.toJSON());
      });

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(response)}`);
    return response;
  }
}
