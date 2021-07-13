import { TestBed, async, inject } from '@angular/core/testing';

import { GovernmentGuard } from './government.guard';

describe('GovernmentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GovernmentGuard]
    });
  });

  it('should ...', inject([GovernmentGuard], (guard: GovernmentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
