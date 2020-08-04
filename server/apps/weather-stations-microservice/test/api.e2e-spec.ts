import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WeatherStationsMicroserviceModule } from './../src/app.module';
import { WeatherStationDto } from '@ri/weather-stations-module';

describe('API (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherStationsMicroserviceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/weather-stations (GET)', () => {
    const expectedData: WeatherStationDto[] = [
      {
        id: 1,
        name: 'ABC',
        humidity: null,
        temperature: null,
        timestamp: null,
      }, {
        id: 2,
        name: 'XYZ',
        humidity: null,
        temperature: null,
        timestamp: null,
      },
    ];

    return request(app.getHttpServer())
      .get('/api/weather-stations')
      .expect(200)
      .expect(expectedData);
  });

  afterAll(async done => {
    await app.close();
  });
});
