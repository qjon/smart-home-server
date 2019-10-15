import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoggerMiddleware } from './main/logger';

@Module({
  controllers: [MainController],
})
export class SslModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
