import { TestBed } from '@angular/core/testing';

import { SwitchesListResolverService } from './switches-list-resolver.service';

describe('SwitchesListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchesListResolverService = TestBed.get(SwitchesListResolverService);
    expect(service).toBeTruthy();
  });
});
