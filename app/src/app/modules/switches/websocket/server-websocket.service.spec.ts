import { TestBed } from '@angular/core/testing';

import { ServerWebsocketService } from './server-websocket.service';

describe('ServerWebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerWebsocketService = TestBed.get(ServerWebsocketService);
    expect(service).toBeTruthy();
  });
});
