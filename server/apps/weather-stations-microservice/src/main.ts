import { NestFactory } from '@nestjs/core';
import { WeatherStationsMicroserviceModule } from './app.module';
import { environment } from '../environment';
import { join } from "path";
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(WeatherStationsMicroserviceModule);

  app.enableCors();
  app.useStaticAssets(join(__dirname, 'app'));

  await app.listen(environment.server.port);
}

bootstrap();
