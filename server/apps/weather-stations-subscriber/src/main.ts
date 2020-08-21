import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { environment } from '../environment';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const mqttListener = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.MQTT,
    options: {
      hostname: environment.mqtt.host,
      port: environment.mqtt.port,
      username: environment.mqtt.user,
      password: environment.mqtt.password,
    },
  });

  mqttListener.listen(() => {
    logger.log('Mqtt listener starts');
  });
}

bootstrap();
