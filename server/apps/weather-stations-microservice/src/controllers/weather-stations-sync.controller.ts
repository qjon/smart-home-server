import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param, Post, Query,
  Req,
  Request,
} from '@nestjs/common';
import {
  WeatherStationDataRepositoryService, WeatherStationDataResponseItem, WeatherStationEntity,
  WeatherStationRepositoryService,
  WeatherStationService,
  WeatherStationSyncDataInterface,
} from '@ri/weather-stations-module';
import { ObjectEntity, ObjectsEntityRepositoryService } from '@ri/objects';

@Controller('/api/weather-stations')
// @UseFilters(new ApiExceptionFilters())
export class WeatherStationsSyncController {

  protected logger = new Logger(WeatherStationsSyncController.name);

  @Inject(WeatherStationRepositoryService)
  protected weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(WeatherStationDataRepositoryService)
  protected weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  @Inject(WeatherStationService)
  protected weatherStationService: WeatherStationService;

  @Inject(ObjectsEntityRepositoryService)
  protected objectsEntityRepositoryService: ObjectsEntityRepositoryService;

  @Post('sync')
  async sync2(@Req() req: Request,
              @Body() body: { ip: string, sensor: string, data: WeatherStationSyncDataInterface[] }): Promise<any[]> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const entity: ObjectEntity = await this.objectsEntityRepositoryService.fetchEntityObjectByIP(body.ip);

    this.logger.log(entity.id);
    const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationByEntityAndSensor(entity.id, body.sensor || null);

    this.logger.log(weatherStation.id);

    const entities: WeatherStationDataResponseItem[] = await this.weatherStationService.syncData(weatherStation, body.data);

    const response: any[] = entities.map((value: WeatherStationDataResponseItem) => {
      return { time: value.originalTimestamp, sync: !value.isValid || (value.isValid && value.entity.id > 0) };
    });

    this.logger.log(`RES | API | ${req.url}: ${JSON.stringify(response)}`);

    return response;
  }
}
