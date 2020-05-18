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
import { WeatherStationRepositoryService } from '../repository/weather-station-repository.service';
import { WeatherStationDataRepositoryService } from '../repository/weather-station-data-repository.service';
import { WeatherStationDataResponseItem, WeatherStationService } from '../services/weather-station.service';
import { WeatherStationDto } from '../models/weather-station-dto';
import {
  WeatherStationDataDto, WeatherStationDayAvgDataDto,
  WeatherStationMonthAvgDataDto,
  WeatherStationYearAvgDataDto,
} from '../models/weather-station-data-dto';
import { WeatherStationDataEntity } from '../entity/weather-station-data.entity';
import { WeatherStationSyncDataInterface } from '../models/weather-station-data';
import { WeatherStationEntity } from '../entity/weather-station.entity';

@Controller('/api/weather-stations')
// @UseFilters(new ApiExceptionFilters())
export class WeatherStationsController {

  protected logger = new Logger(WeatherStationsController.name);

  @Inject(WeatherStationRepositoryService)
  protected weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(WeatherStationDataRepositoryService)
  protected weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  @Inject(WeatherStationService)
  protected weatherStationService: WeatherStationService;

  @Get()
  async list(@Req() req: Request, @Query('entityId') entityId: string): Promise<WeatherStationDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);
    let response: WeatherStationDto[] = [];

    if (Boolean(entityId)) {
      response = await this.weatherStationRepositoryService.fetchByEntityIdWithLastData(entityId.split(';').map(x => parseInt(x, 10)))
        .then((data) => {
          return data.map(ws => ws.toJSON());
        });
    } else {
      response = await this.weatherStationRepositoryService.fetchAllWithLastData()
        .then((data) => {
          return data.map(ws => ws.toJSON());
        });
    }

    this.logger.log(`RES | API | ${req.url} | ${JSON.stringify(response)}`);
    return response;
  }

  @Get(':id/data')
  async data(@Req() req: Request,
             @Param('id') weatherStationId: number,
             @Query('from') from: number,
             @Query('to') to: number = null): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    from = Math.ceil(from / 1000);
    to = Math.floor(to / 1000);

    const response = await this.weatherStationDataRepositoryService.fetchDataFromPeriodOfType(weatherStationId, from, to)
      .then((data: WeatherStationDataEntity[]) => {
        return data.map((wsd) => wsd.toJSON());
      });

    this.logger.log(`RES | API | ${req.url} | number of items: ${JSON.stringify(response.length)}`);
    return response;
  }

  @Get(':id/data/month')
  async monthData(@Req() req: Request,
                  @Param('id') weatherStationId: number,
                  @Query('year') year: number,
                  @Query('month') month: number): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.weatherStationDataRepositoryService.fetchDataFromMonth(weatherStationId, year, month)
      .then((data: Array<Partial<WeatherStationMonthAvgDataDto>>) => {
        return data.map((wsd: Partial<WeatherStationMonthAvgDataDto>, index) => {
          return {
            id: index,
            timestamp: (new Date(year, month, wsd.day)).getTime(),
            temperature: parseFloat(wsd.avgTemperature.toFixed(2)),
            humidity: parseFloat(wsd.avgHumidity.toFixed(2)),
          };
        });
      });

    this.logger.log(`RES | API | ${req.url} | number of items: ${JSON.stringify(response.length)}`);

    return response;
  }

  @Get(':id/data/year')
  async yearData(@Req() req: Request,
                 @Param('id') weatherStationId: number,
                 @Query('year') year: number): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.weatherStationDataRepositoryService.fetchDataFromYear(weatherStationId, year)
      .then((data: Array<Partial<WeatherStationYearAvgDataDto>>) => {
        return data.map((wsd: Partial<WeatherStationYearAvgDataDto>, index) => {
          return {
            id: index,
            timestamp: (new Date(year, wsd.month - 1, 1)).getTime(),
            temperature: parseFloat(wsd.avgTemperature.toFixed(2)),
            humidity: parseFloat(wsd.avgHumidity.toFixed(2)),
          };
        });
      });

    this.logger.log(`RES | API | ${req.url} | number of items: ${JSON.stringify(response.length)}`);

    return response;
  }

  @Get(':id/data/week')
  async dayAggregateDataForWeek(@Req() req: Request,
                                @Param('id') weatherStationId: number,
                                @Query('year') year: number,
                                @Query('month') month: number,
                                @Query('day') day: number): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const from = (new Date(year, month, day, 0, 0, 0)).getTime();
    const to = from + 7 * 24 * 60 * 60 * 1000;

    const response = await this.weatherStationDataRepositoryService.fetchDataFromWeek(weatherStationId, from / 1000, to / 1000)
      .then((data: Array<Partial<WeatherStationMonthAvgDataDto>>) => {
        this.logger.log(JSON.stringify(data));
        return data.map((wsd: Partial<WeatherStationMonthAvgDataDto>, index) => {
          return {
            id: index,
            timestamp: (new Date(year, wsd.month - 1, wsd.day, 0, 0, 0)).getTime(),
            temperature: parseFloat(wsd.avgTemperature.toFixed(2)),
            humidity: parseFloat(wsd.avgHumidity.toFixed(2)),
          };
        });
      });

    this.logger.log(`RES | API | ${req.url} | number of items: ${JSON.stringify(response.length)}`);

    return response;
  }

  @Get(':id/data/day')
  async dayData(@Req() req: Request,
                @Param('id') weatherStationId: number,
                @Query('year') year: number,
                @Query('month') month: number,
                @Query('day') day: number): Promise<WeatherStationDataDto[]> {
    this.logger.log(`REQ | API | ${req.url}`);

    const response = await this.weatherStationDataRepositoryService.fetchDataFromDay(weatherStationId, year, month, day)
      .then((data: Array<Partial<WeatherStationDayAvgDataDto>>) => {
        return data.map((wsd: Partial<WeatherStationDayAvgDataDto>, index) => {
          return {
            id: index,
            timestamp: (new Date(year, month - 1, day, wsd.hour, 0, 0)).getTime(),
            temperature: parseFloat(wsd.avgTemperature.toFixed(2)),
            humidity: parseFloat(wsd.avgHumidity.toFixed(2)),
          };
        });
      });

    this.logger.log(`RES | API | ${req.url} | number of items: ${JSON.stringify(response.length)}`);

    return response;
  }

  @Post('sync')
  async sync2(@Req() req: Request,
              @Body() body: { ip: string, sensor: number, data: WeatherStationSyncDataInterface[] }): Promise<any[]> {
    this.logger.log(`REQ | API | ${req.url} | ${JSON.stringify(body)}`);

    const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationByHostAndSensor(body.ip, body.sensor || 0);

    const entities: WeatherStationDataResponseItem[] = await this.weatherStationService.syncData(weatherStation, body.data);

    const response: any[] = entities.map((value: WeatherStationDataResponseItem) => {
      return { time: value.originalTimestamp, sync: !value.isValid || (value.isValid && value.entity.id > 0) };
    });

    this.logger.log(`RES | API | ${req.url}: ${JSON.stringify(response)}`);

    return response;
  }
}
