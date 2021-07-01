import { Component, OnInit } from '@angular/core';
import { ProposalService } from "./proposal.service";
import { IProposal } from '../shared/models/proposal';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  proposal: IProposal;
  newVoteName: string;

  constructor(private proposalSerivce: ProposalService) { }

  ngOnInit() {
    if (this.proposalSerivce.proposal) {
      this.proposal = this.proposalSerivce.proposal;
    } else {
      console.log('proposal not loaded');
    }
  }

  public craeteVote() {
    this.proposalSerivce.createVote('QmVDbN4zw8SfFRsSGKcBXF9VnVMFmi7exYhj2nW86Uv62z', this.newVoteName);
  }

  setNewVoteName(e: any) {
    this.newVoteName = e.target.value;
  }

}
