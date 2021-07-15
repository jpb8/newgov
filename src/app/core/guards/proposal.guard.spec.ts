import { TestBed, async, inject } from '@angular/core/testing';

import { ProposalGuard } from './proposal.guard';

describe('ProposalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProposalGuard]
    });
  });

  it('should ...', inject([ProposalGuard], (guard: ProposalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
