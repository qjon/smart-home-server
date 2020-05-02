import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { HomeAssistantModule } from './home-assistant/home-assistant.module';
import { Transport } from '@nestjs/microservices';

const pidFile = __dirname + '/smart-home-server.pid';

async function bootstrap() {
  const logger = new Logger('Application');

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

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //
  // app.enableCors();
  // app.useWebSocketAdapter(new SmartWsAdapterService());
  // app.useStaticAssets(join(__dirname, '..', 'app'));
  //
  // const logRequestStart = (req: any, res: any, next: NextFunction) => {
  //   console.info(`${req.method} ${req.originalUrl}`);
  //
  //   res.on('finish', () => {
  //     console.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  //   });
  //
  //   next();
  // };
  //
  // app.use(logRequestStart);
  // app.listen(environment.apiPort);
  //
  // await app.init();
  //
  // const deviceService: DeviceService = app.get(DeviceService);
  // deviceService.disconnectAllDevices();
  //
  // process.on('SIGTERM', () => {
  //   app.close()
  //     .then(() => {
  //       logger.log('Remove PID file');
  //       fs.unlinkSync(pidFile);
  //       logger.error('Process shutdown');
  //     })
  //     .then(() => process.exit(0));
  // });
}

bootstrap()
  .catch(() => {
    fs.unlinkSync(pidFile);
  });


