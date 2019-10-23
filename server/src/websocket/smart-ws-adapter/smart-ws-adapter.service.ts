import { INestApplicationContext, Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { environment } from '../../environments';
import * as WebSocket from 'nodejs-websocket';
import { MessageMappingProperties } from '@nestjs/websockets';
import { fromEvent, Observable, of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { Server } from 'tls';
import { CLOSE_EVENT, CONNECTION_EVENT, ERROR_EVENT } from '@nestjs/websockets/constants';


// const ws = require('ws');
const fs = require('fs');
const https = require('https');
const keyFile = fs.readFileSync(__dirname + '/../../../certs/server.key');
const certFile = fs.readFileSync(__dirname + '/../../../certs/server.crt');

export class SmartWsAdapterService extends WsAdapter {
  protected logger = new Logger(SmartWsAdapterService.name);

  protected wss: Server;

  constructor(protected appOrHttpServer?: INestApplicationContext | any, protected server?: any) {
    super(appOrHttpServer);
  }

  public create(port: number, options?: any & {
    namespace?: string;
    server?: any;
  }): any {

    const opt = {
      cert: certFile,
      key: keyFile,
      secure: true,
      port: environment.websocketsPort,
    };

    this.wss = WebSocket.createServer(opt, (data) => {
      this.logger.verbose('WS | STart');
    });

    this.wss.listen(environment.websocketsPort);

    return this.wss;
  }

  public bindMessageHandlers(client: WebSocket, handlers: MessageMappingProperties[], process: (data: any) => Observable<any>) {
    fromEvent(client, 'text')
      .pipe(
        mergeMap(data => {
          return this.bindMessageHandler(data, handlers, process);
        }),
        filter(result => result),
      )
      .subscribe(response => client.send(JSON.stringify(response)));
  }


  public bindMessageHandler(buffer: any, handlers: MessageMappingProperties[], process: (data: any) => Observable<any>): Observable<any> {
    const message = JSON.parse(buffer);
    const isApplication = message.sender === 'application';

    let messageHandler = handlers.find(handler => handler.message === message.action);

    if (!isApplication && !messageHandler) {
      messageHandler = handlers.find(handler => handler.message === 'default');
    }

    if (!messageHandler) {
      return of(null);
    }

    return process(messageHandler.callback(message));
  }


  public bindErrorHandler(server: any) {
    server.on(CONNECTION_EVENT, ws =>
      ws.on(ERROR_EVENT, (err: any) => this.logger.error(err)),
    );
    server.on(ERROR_EVENT, (err: any) => this.logger.error(err));
    return server;
  }

  public bindClientDisconnect(client: any, callback: any) {
    client.on(CLOSE_EVENT, callback);
  }
}
