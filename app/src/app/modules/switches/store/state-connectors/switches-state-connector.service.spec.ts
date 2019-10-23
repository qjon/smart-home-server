import { TestBed } from '@angular/core/testing';

import { SwitchesStateConnectorService } from './switches-state-connector.service';

describe('SwitchesStateConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchesStateConnectorService = TestBed.get(SwitchesStateConnectorService);
    expect(service).toBeTruthy();
  });
});
