import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';
import { SslModule } from './ssl/ssl.module';
import { AppController } from './app.controller';
import { StorageModule } from './storage/storage.module';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './environments';
import { WorkersModule } from './workers/workers.module';
import { MdnsModule } from './mdns/mdns.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HomeAssistantModule } from './home-assistant/home-assistant.module';

@Module({
  imports: [
    WebsocketModule, SslModule, StorageModule, ApiModule, DatabaseModule,


    HomeAssistantModule,
        TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.database.host,
      port: 3306,
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    WorkersModule,

    MdnsModule,

    MailerModule.forRoot({
      transport: 'smtps://' + environment.mail.username + ':' + environment.mail.password + '@' + environment.mail.smtp,
      defaults: {
        from: environment.mail.from,
      },
    }),

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
