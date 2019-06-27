import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';

describe('Main Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MainController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MainController = module.get<MainController>(MainController);
    expect(controller).toBeDefined();
  });
});
