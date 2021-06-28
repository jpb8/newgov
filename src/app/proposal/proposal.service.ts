import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { IProposal, IVote, IBid } from '../shared/models/proposal';

const proposal_artifacts = require('../../../build/contracts/Proposal.json');

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  public address: string;
  public proposal: IProposal;
  public ProposalContract: any;

  constructor(private web3Service: Web3Service) { }

  async loadContract(address: string) {
    if(!address) {
      console.log('No address for government');
      return;
    }
    await this.web3Service.artifactAndAddressToContract(proposal_artifacts, address)
      .then((ProposalAbstraction) => {
        this.ProposalContract = ProposalAbstraction;
        console.log(this.ProposalContract);
        console.log('Proposal Contract');
      });
  }

  async loadProposal() {
    if (!this.ProposalContract) {
      console.log('Proposal Contract Not Loaded');
      return;
    }
    const supportRequiredPct = await this.ProposalContract.supportRequiredPct();
    const minAcceptQuorumPct = await this.ProposalContract.minAcceptQuorumPct();
    const voteTime = await this.ProposalContract.voteTime();
    const votesLength = await this.ProposalContract.votesLength();
    var votes = []
    if (votesLength > 0) {
      votes = await this.getVotes(votesLength);
    } else {
      votes= [];
    }
    this.proposal = {
      supportRequiredPct: supportRequiredPct,
      minAcceptQuorumPct: minAcceptQuorumPct,
      voteTime: voteTime,
      votesLength: votesLength,
      votes: votes
    }
    console.log(this.proposal);
  }

  async getVotes(totalVotes: number): Promise<IVote[]> {
    const votes = [];
    if (!this.ProposalContract) {
      console.log('Proposal Contract Not Loaded');
      return votes;
    }
    
    for (var i = 1; i <= totalVotes; i++) {
      const _vote = await this.ProposalContract.getVote(i);
      votes.push({
        id: i,
        open: _vote[0],
        executed: _vote[1],
        startDate: _vote[2],
        snapshotBlock: _vote[3],
        supportRequiredPct: _vote[4],
        minAcceptQuorumPct: _vote[5],
        votingPower: _vote[6],
        bidsLength: 0,
        winningBidId: 0,
        bids: [],
        voters: []
      })
    }
    return votes;
  }
}
