import {TestBed} from '@angular/core/testing';

import {SwitchesApiService} from './switches-api.service';

describe('SwitchesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchesApiService = TestBed.get(SwitchesApiService);
    expect(service).toBeTruthy();
  });
});
