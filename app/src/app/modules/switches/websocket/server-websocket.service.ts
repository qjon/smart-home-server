import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Observable, Subscription} from 'rxjs';
import {delay, retryWhen, tap} from 'rxjs/operators';
import {SwitchesChangeConnectionStatusAction, SwitchesUpdateAction} from '../store/switches-actions';
import {Store} from '@ngrx/store';
import {environment} from '../../../../environments/environment';

export interface ServerMessage {
  sender: string;
  action: string;
  deviceId?: string;
  params?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ServerWebsocketService {
  public socket$: Observable<ServerMessage>;

  protected url = `wss://${environment.ws.host}:${environment.ws.port}`;

  protected retryInterval = 3000; // in milliseconds

  protected wss = new WebSocketSubject<ServerMessage>(this.url);

  protected subscription: Subscription;

  constructor(protected store: Store<any>) {
    this.socket$ = this.wss.asObservable()
      .pipe(
        retryWhen(errors => errors
          .pipe(
            delay(this.retryInterval),
            tap(() => this.register())
          )
        )
      );

    this.subscription = this.socket$
      .subscribe((message: ServerMessage) => {
        switch (message.action) {
          case 'app:update':
            this.updateDeviceInfo(message);
            break;
          case 'app:isConnected':
            this.updateDeviceIsConnected(message);
            break;
          default:
            return;
        }
      });

  }

  public register(): void {
    this.wss.next({sender: 'application', action: 'app:register'});
  }

  public close() {
    this.wss.unsubscribe();
  }

  protected updateDeviceInfo(message: ServerMessage) {
    this.store.dispatch(new SwitchesUpdateAction({deviceId: message.deviceId, params: message.params}));
  }

  protected updateDeviceIsConnected(message: ServerMessage) {
    this.store.dispatch(new SwitchesChangeConnectionStatusAction({deviceId: message.deviceId, isConnected: !!message.params}));
  }
}
