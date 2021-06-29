import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../proposal.service';
import { IVote } from '../../shared/models/proposal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vote-detail',
  templateUrl: './vote-detail.component.html',
  styleUrls: ['./vote-detail.component.css']
})
export class VoteDetailComponent implements OnInit {
  vote: IVote;
  constructor(
    private proposalService: ProposalService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadVote();
  }

  async loadVote() {
    this.vote = await this.proposalService.getFullVote(+this.activateRoute.snapshot.paramMap.get('id'))
  }

}
