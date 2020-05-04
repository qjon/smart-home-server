import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SmartWsAdapterService } from './websocket/smart-ws-adapter/smart-ws-adapter.service';
import { join } from 'path';
import { environment } from '../environments';

const pidFile = __dirname + '/smart-home-server.pid';

async function bootstrap() {
  const logger = new Logger('Application');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useWebSocketAdapter(new SmartWsAdapterService());
  app.useStaticAssets(join(__dirname, '..', 'app'));
  app.listen(environment.apiPort);
}

bootstrap()
  .catch(() => {
    fs.unlinkSync(pidFile);
  });


