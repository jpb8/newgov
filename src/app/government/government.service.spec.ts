import { TestBed } from '@angular/core/testing';

import { GovernmentService } from './government.service';

describe('GovernmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GovernmentService = TestBed.get(GovernmentService);
    expect(service).toBeTruthy();
  });
});
