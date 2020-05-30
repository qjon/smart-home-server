import { Controller, Inject, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';

import { ObjectEntity, ObjectsEntityCreatorService, ObjectsEntityRepositoryService } from '@ri/objects';
import {
  WeatherStationDataEntity,
  WeatherStationDataInterface,
  WeatherStationDataRepositoryService,
  WeatherStationEntity,
  WeatherStationRepositoryService,
  WeatherStationService,
} from '@ri/weather-stations-module';

import { EntityManager } from 'typeorm';

import { HomeAssistantSubscriberService } from './app.service';
import { InfoModuleModel } from './models/info-module.model';
import { MainStatusConfigDataModel } from './models/main-status-config-data.model';
import { ObjectEntityDataDto } from '@ri/objects/models/object-entity-data-dto';

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
  TempUnit: WeatherStationTemperatureUnit;
}

export interface WeatherStationMqttData {
  uniqId: string;
  sensor: number;
  payload: {
    time: number;
    temp: string;
    hum: string;
  }
}

export interface WeatherStationSensorWelcomeData {
  symbol: number;
  name: string;
}

export interface WeatherStationWelcomeData {
  uniqId: string;
  sensors: WeatherStationSensorWelcomeData[];
  ip: string;
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

  @Inject(ObjectsEntityCreatorService)
  private objectsEntityCreatorService: ObjectsEntityCreatorService;

  @Inject(WeatherStationService)
  private weatherStationService: WeatherStationService;

  private logger = new Logger(this.constructor.name);

  @MessagePattern('ws/+/SENSOR')
  async wsSensor(@Payload() data: WeatherStationMqttData, @Ctx() context: MqttContext) {
    const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT - Welcome device message: ${deviceSymbol}`);
    this.logger.log('Data: ' + JSON.stringify(data));

    const entity: ObjectEntity = await this.objectsEntityRepositoryService.fetchEntityByUniqId(data.uniqId);

    try {
      const sensorData: WeatherStationDataInterface = this.convertDataForSensor(data);

      const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationByEntityIdAndSensor(entity.id, data.sensor.toString());

      if (weatherStation) {
        this.saveStationData(weatherStation, sensorData);
        this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - (${weatherStation.sensor})`);
      }
    } catch (e) {
      this.logger.error(e.toString());
    }


    this.logger.log('--------------------------------------------------------------');
  }

  @MessagePattern('ws/+/INFO')
  async registerWS(@Payload() data: WeatherStationWelcomeData, @Ctx() context: MqttContext) {
    const deviceSymbol: string = this.homeAssistantSubscriberService.convertTopicToDeviceSymbol(context.getTopic());
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT - Welcome device message: ${deviceSymbol}`);
    this.logger.log('Data: ' + JSON.stringify(data));

    try {
      const entity: ObjectEntity = await this.createOrUpdateObjectEntity(data);

      await Promise.all(data.sensors.map((sensor: WeatherStationSensorWelcomeData) => {
        return this.weatherStationService.createWeatherStation(entity.id, sensor.symbol, sensor.name);
      }));
    } catch (e) {
      this.logger.error(e.toString());
    }

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


  @MessagePattern('tele/+/SENSOR')
  async saveSensorData(@Payload() data: MqttWeatherStationPayload, @Ctx() context: MqttContext) {
    this.logger.log('--------------------------------------------------------------');
    this.logger.log(`MQTT - Sensor data message: ${context.getTopic()}`);
    this.logger.log('Data: ' + JSON.stringify(data));
    const entity: ObjectEntity = await this.objectsEntityRepositoryService.fetchEntityObjectByFullSensorTopic(context.getTopic());

    const dataSensorSymbols: string[] = this.getDataSensorSymbols(data);

    for (const symbol of dataSensorSymbols) {
      try {
        const sensorData: WeatherStationDataInterface = this.getDataForSensor(data, symbol);

        const weatherStation: WeatherStationEntity = await this.weatherStationRepositoryService.fetchWeatherStationByEntityIdAndSensor(entity.id, symbol);

        if (weatherStation) {

          this.saveStationData(weatherStation, sensorData);
          this.logger.log(`MQTT - sensor data saved for device: ${weatherStation.name} - (${weatherStation.sensor})`);
        }
      } catch (e) {
        this.logger.error(e.toString());
      }
    }
    this.logger.log('--------------------------------------------------------------');
  }

  private async createOrUpdateObjectEntity(data: WeatherStationWelcomeData): Promise<ObjectEntity> {
    let entity: ObjectEntity;

    entity = await this.objectsEntityRepositoryService.fetchEntityByUniqId(data.uniqId);

    if (entity) {
      // update ip
      entity.ip = data.ip;
      return this.entityManager.save(entity);
    } else {
      const { uniqId, ip } = data;
      const objectEntityData: ObjectEntityDataDto = {
        uniqId,
        name: uniqId,
        ip,
      };

      return this.objectsEntityCreatorService.create(objectEntityData);
    }
  }

  private saveStationData(weatherStation: WeatherStationEntity, entityData: WeatherStationDataInterface): void {
    const entity: WeatherStationDataEntity = this.entityManager.create(WeatherStationDataEntity, entityData);

    entity.weatherStation = weatherStation;

    weatherStation.lastData = entity;

    this.entityManager.save([entity, weatherStation]);
  }

  private getDataSensorSymbols(data: MqttWeatherStationPayload): string[] {
    const dataKeys: string[] = Object.keys(data)
      .filter((key: string) => key !== 'Time' && key !== 'TempUnit');

    return dataKeys;
  }

  private getDataForSensor(data: MqttWeatherStationPayload, sensorSymbol: string): WeatherStationDataInterface | null {
    let sensorData: WeatherStationData = data[sensorSymbol];

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

  private convertDataForSensor(data: WeatherStationMqttData): WeatherStationDataInterface | null {
    return {
      humidity: parseFloat(data.payload.hum),
      temperature: parseFloat(data.payload.temp),
      timestamp: data.payload.time,
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

      entity.uniqId = data.uniq_id;

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
