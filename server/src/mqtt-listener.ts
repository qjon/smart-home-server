import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { HomeAssistantModule } from './home-assistant/home-assistant.module';
import { Transport } from '@nestjs/microservices';

const pidFile = __dirname + '/mqtt-listener.pid';

async function bootstrap() {
  fs.writeFileSync(pidFile, '');

  const mqttSubscriber = await NestFactory.createMicroservice(HomeAssistantModule, {
    transport: Transport.MQTT,
    options: {
      hostname: '192.168.100.3',
      port: 1883,
      username: 'subscriber',
      password: 'mqttsubscriber',
    },
  });

  mqttSubscriber.listen(() => console.log('Microservice is listening'));
}

bootstrap()
  .catch(() => {
    fs.unlinkSync(pidFile);
  });


