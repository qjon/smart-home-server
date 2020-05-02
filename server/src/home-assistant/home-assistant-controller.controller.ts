import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { HomeAssistantSubscriberService } from './home-assistant-subscriber.service';
import { WeatherStationEntity } from '../database/entity/weather-station.entity';
import { WeatherStationRepositoryService } from '../database/repository/weather-station-repository.service';
import { WeatherStationDataEntity } from '../database/entity/weather-station-data.entity';
import { WeatherStationDataRepositoryService } from '../database/repository/weather-station-data-repository.service';
import { WeatherStationDataInterface } from '../interfaces/weather-station/weather-station-data';
import { EntityManager } from 'typeorm';

export enum WeatherStationTemperatureUnit {
  Celsius = 'C',
  Fahrenheit = 'F',
}

export interface WeatherStationData {
  DewPoint: number;
  Humidity: number;
  Temperature: number;
}

export interface MqttWeatherStationPayload {
  Time: string;
  DHT11?: WeatherStationData;
  DHT22?: WeatherStationData;
  TempUnit: WeatherStationTemperatureUnit;
}

@Controller()
export class HomeAssistantControllerController {

  @Inject(HomeAssistantSubscriberService)
  private homeAssistantSubscriberService: HomeAssistantSubscriberService;

  @Inject(WeatherStationRepositoryService)
  private weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(WeatherStationDataRepositoryService)
  private weatherStationDataRepositoryService: WeatherStationDataRepositoryService;

  @Inject(EntityManager)
  private entityManager: EntityManager;

  private logger = new Logger(this.constructor.name);

  @MessagePattern('esp/+/LWT')
  async regitserESP(@Payload() data: any, @Ctx() context: MqttContext) {
    const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT - Welcome device message: ${deviceSymbol}`);
    this.logger.log('Data: ' + JSON.stringify(data));
    this.logger.log('--------------------------------------------------------------');
  }

  @MessagePattern('esp/+/SENSOR')
  async saveSensorData(@Payload() data: MqttWeatherStationPayload, @Ctx() context: MqttContext) {
    this.logger.log('--------------------------------------------------------------');
    const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
    this.logger.log(`MQTT - Sensor data message: ${deviceSymbol}`);
    this.logger.log('Data: ' + JSON.stringify(data));
    const sensorOneData: WeatherStationDataInterface = this.getDataForSensor(data, 0);
    const sensorTwoData: WeatherStationDataInterface = this.getDataForSensor(data, 1);
    if (sensorOneData) {

      const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationBySymbolAndSensor(deviceSymbol, 0);
      if (weatherStation) {

        this.saveStationData(weatherStation, sensorOneData);
        this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - ${weatherStation.symbol} (${weatherStation.sensor})`);
      }
    }
    if (sensorTwoData) {

      const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationBySymbolAndSensor(deviceSymbol, 1);
      if (weatherStation) {

        this.saveStationData(weatherStation, sensorOneData);
        this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - ${weatherStation.symbol} (${weatherStation.sensor})`);
      }
    }
    this.logger.log('--------------------------------------------------------------');
  }

  private saveStationData(weatherStation: WeatherStationEntity, entityData: WeatherStationDataInterface): void {
    const entity: WeatherStationDataEntity = this.entityManager.create(WeatherStationDataEntity, entityData);

    entity.weatherStation = weatherStation;

    weatherStation.lastData = entity;

    this.entityManager.save([entity, weatherStation]);
  }

  private getDataForSensor(data: MqttWeatherStationPayload, sensor: number): WeatherStationDataInterface | null {
    let sensorData: WeatherStationData = null;

    if (sensor === 0) {
      if (Boolean(data.DHT11)) {
        sensorData = data.DHT11;
      }
    } else {
      if (Boolean(data.DHT22)) {
        sensorData = data.DHT22;
      }
    }

    if (!Boolean(sensorData)) {
      return null;
    }

    const timestampInSec: number = Math.ceil((new Date(data.Time)).getTime() / 1000);

    return {
      humidity: sensorData.Humidity,
      temperature: sensorData.Temperature,
      timestamp: timestampInSec,
    };
  }
}
