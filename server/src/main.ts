import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environments';
import { SmartWsAdapterService } from './websocket/smart-ws-adapter/smart-ws-adapter.service';
import * as express from 'express';
import { NextFunction } from 'express';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as http from 'http';
import { join } from 'path';
import * as fs from 'fs';
import { DeviceService } from './database/services/device.service';
import { Logger } from '@nestjs/common';

const pidFile = __dirname + '/smart-home-server.pid';

async function bootstrap() {
  const logger = new Logger('Application');

  fs.writeFileSync(pidFile, '');

  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  app.enableCors();
  app.useWebSocketAdapter(new SmartWsAdapterService());
  app.useStaticAssets(join(__dirname, '..', 'app'));

  const logRequestStart = (req: any, res: any, next: NextFunction) => {
    console.info(`${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      console.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
    });

    next();
  };

  app.use(logRequestStart);

  await app.init();

  const serverHttp = http.createServer(server).listen(environment.apiPort);

  const deviceService: DeviceService = app.get(DeviceService);
  deviceService.disconnectAllDevices();

  process.on('SIGTERM', () => {
    serverHttp.close(() => {
      logger.warn('HTTP Process terminated');
    });

    app.close()
      .then(() => {
        logger.log('Remove PID file');
        fs.unlinkSync(pidFile);
        logger.error('Process shutdown');
      })
      .then(() => process.exit(0));
  });
}

bootstrap()
  .catch(() => {
    fs.unlinkSync(pidFile);
  });

