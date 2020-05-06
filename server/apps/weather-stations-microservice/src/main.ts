import { NestFactory } from '@nestjs/core';
import { WeatherStationsMicroserviceModule } from './app.module';
import { environment } from '../environment';

async function bootstrap() {
  const app = await NestFactory.create(WeatherStationsMicroserviceModule);

  app.enableCors();

  await app.listen(environment.server.port);
}

bootstrap();
