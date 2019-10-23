import { TestBed } from '@angular/core/testing';

import { SwitchesEffectsService } from './switches-effects.service';

describe('SwitchesEffectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchesEffectsService = TestBed.get(SwitchesEffectsService);
    expect(service).toBeTruthy();
  });
});
