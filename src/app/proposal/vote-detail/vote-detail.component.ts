import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProposalService } from '../proposal.service';
import { IVote } from '../../shared/models/proposal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vote-detail',
  templateUrl: './vote-detail.component.html',
  styleUrls: ['./vote-detail.component.css']
})
export class VoteDetailComponent implements OnInit {
  @ViewChild('newBidName', {static: false}) newBidName: ElementRef;
  @ViewChild('newBidCost', {static: false}) newBidCost: ElementRef;
  vote: IVote;
  
  constructor(
    private proposalService: ProposalService,
    private activateRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    await this.loadVote();
  }

  async loadVote() {
    this.vote = await this.proposalService.getFullVote(+this.activateRoute.snapshot.paramMap.get('id'))
    console.log(this.vote);
  }

  async createNewBid() {
    const name = this.newBidName.nativeElement.value;
    const cost = this.newBidCost.nativeElement.value;
    const tx = await this.proposalService.createBid(this.vote.id, 'ipfshash', cost, name);
    console.log(tx);
    // TODO Get Bid from tx event and append to vote Bids
  }

}
