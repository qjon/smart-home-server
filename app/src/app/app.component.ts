import {Component, OnDestroy} from '@angular/core';
import {ServerWebsocketService} from './modules/switches/websocket/server-websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'smart-home';

  constructor(private serverWebsocketService: ServerWebsocketService) {
    this.serverWebsocketService.register();
  }

  closeConnection() {
    this.serverWebsocketService.close();
  }

  public ngOnDestroy(): void {
    this.closeConnection();
  }
}
