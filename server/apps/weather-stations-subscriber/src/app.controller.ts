import { Controller, Inject, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';
import { HomeAssistantSubscriberService } from './app.service';
import {
  WeatherStationDataEntity,
  WeatherStationDataInterface,
  WeatherStationDataRepositoryService, WeatherStationEntity,
  WeatherStationRepositoryService,
} from '@ri/weather-stations-module';
import { environment } from '../environment';
import { InfoModuleModel } from './models/info-module.model';
import { ObjectEntity, ObjectsEntityRepositoryService } from '@ri/objects';
import { MainStatusConfigDataModel } from './models/main-status-config-data.model';

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

  @Inject(ObjectsEntityRepositoryService)
  private objectsEntityRepositoryService: ObjectsEntityRepositoryService;

  @Inject(EntityManager)
  private entityManager: EntityManager;

  private logger = new Logger(this.constructor.name);

  @MessagePattern('tele/+/LWT')
  async registerESP(@Payload() data: any, @Ctx() context: MqttContext) {
    const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT - Welcome device message: ${deviceSymbol}`);
    this.logger.log('Data: ' + JSON.stringify(data));
    this.logger.log('--------------------------------------------------------------');
  }

  @MessagePattern('tele/+/INFO2')
  async infoIP(@Payload() data: InfoModuleModel, @Ctx() context: MqttContext) {
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT: ${context.getTopic()}`);
    this.logger.log('Data: ' + JSON.stringify(data));
    await this.assignTopicToWeatherStation(context.getTopic(), data);
    this.logger.log('--------------------------------------------------------------');
  }

  @MessagePattern('homeassistant/sensor/+/config')
  async assignEntityUniqueId(@Payload() data: MainStatusConfigDataModel, @Ctx() context: MqttContext) {
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT: ${context.getTopic()}`);
    this.logger.log('Data: ' + JSON.stringify(data));

    if (this.filterSensorStatusConfig(context.getTopic())) {
      await this.assignUniqueId(data);
    }

    this.logger.log('--------------------------------------------------------------');
  }

  //
  // @MessagePattern('tele/+/SENSOR')
  // async saveSensorData(@Payload() data: MqttWeatherStationPayload, @Ctx() context: MqttContext) {
  //   this.logger.log('--------------------------------------------------------------');
  //   const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
  //   this.logger.log(`MQTT - Sensor data message: ${deviceSymbol}`);
  //   this.logger.log('Data: ' + JSON.stringify(data));
  //   const sensorOneData: WeatherStationDataInterface = this.getDataForSensor(data, 0);
  //   const sensorTwoData: WeatherStationDataInterface = this.getDataForSensor(data, 1);
  //   if (sensorOneData) {
  //
  //     const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationBySymbolAndSensor(deviceSymbol, 0);
  //     if (weatherStation) {
  //
  //       this.saveStationData(weatherStation, sensorOneData);
  //       this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - ${weatherStation.symbol} (${weatherStation.sensor})`);
  //     }
  //   }
  //   if (sensorTwoData) {
  //
  //     const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationBySymbolAndSensor(deviceSymbol, 1);
  //     if (weatherStation) {
  //
  //       this.saveStationData(weatherStation, sensorOneData);
  //       this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - ${weatherStation.symbol} (${weatherStation.sensor})`);
  //     }
  //   }
  //   this.logger.log('--------------------------------------------------------------');
  // }

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

  private filterSensorStatusConfig(topic: string): boolean {
    return topic.indexOf('_status/') > -1;
  }

  private async assignTopicToWeatherStation(topic: string, data: InfoModuleModel) {
    const wsTopic: string = this.getDeviceTopic(topic);

    try {
      const entity: ObjectEntity = await this.objectsEntityRepositoryService.fetchEntityObjectByIP(data.IPAddress);

      entity.host = data.Hostname;
      entity.topic = wsTopic;
      entity.topicSensorFull = this.getSensorTopic(wsTopic);

      this.entityManager.save(entity);

      this.logger.log(`Assign topic "${wsTopic}" to Entity ${entity.name} (${entity.id})`);
    } catch {
      this.logger.log(`No entity for IP ${data.IPAddress}`);
    }
  }


  private async assignUniqueId(data: MainStatusConfigDataModel): Promise<void> {
    const wsTopic: string = this.getDeviceTopic(data.stat_t);

    try {
      const entity: ObjectEntity = await this.objectsEntityRepositoryService.fetchEntityObjectByTopic(wsTopic);

      entity.uniqueId = data.uniq_id;

      this.entityManager.save(entity);

      this.logger.log(`Assign unique id "${data.uniq_id}" to Entity ${entity.name} (${entity.id})`);
    } catch {
      this.logger.log(`No entity for Topic ${wsTopic}`);
    }
  }

  private getDeviceTopic(topic: string, isConfig: boolean = false): string {
    const topicArray: string[] = topic.split('/');

    return isConfig ? topicArray[2] : topicArray[1];
  }

  private getSensorTopic(wsTopic: string): string {
    return `tele/${wsTopic}/SENSOR`;
  }
}
