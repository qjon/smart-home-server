import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';

@Module({
  controllers: [MainController]
})
export class SslModule {}
