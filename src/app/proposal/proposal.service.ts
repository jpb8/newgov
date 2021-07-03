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
      console.log(votesLength);
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
    
    for (var i = 0; i < totalVotes; i++) {
      const _vote = await this.ProposalContract.getVote(i);
      votes.push({
        id: i,
        open: _vote[0],
        executed: _vote[1],
        ifpshash: _vote[2],
        name: _vote[3],
        startDate: _vote[4],
        snapshotBlock: _vote[5],
        supportRequiredPct: _vote[6],
        minAcceptQuorumPct: _vote[7],
        votingPower: _vote[8],
        bidsLength: _vote[9],
        winningBidId: _vote[10],
        bids: [],
        voters: []
      })
    }
    return votes;
  }

  async createVote(voteIfpsHash: string, voteName: string) {
    if (!this.ProposalContract) {
      console.log('Proposal Contract not active')
      return;
    }
    
    console.log(this.ProposalContract);
    const tx = await this.ProposalContract.newVote.sendTransaction('0x42', voteIfpsHash, voteName, {from: this.web3Service.account});
    console.log(tx);
  }

  async getFullVote(voteId: number): Promise<IVote> {
    if (!this.ProposalContract) {
      console.log('Proposal Contract not active')
      return;
    }
    const _vote = await this.ProposalContract.getVote(voteId);
    var vote = {
      id: voteId,
      open: _vote[0],
      executed: _vote[1],
      ipfshash: _vote[2],
      name: _vote[3],
      startDate: _vote[4],
      snapshotBlock: _vote[5],
      supportRequiredPct: _vote[6],
      minAcceptQuorumPct: _vote[7],
      votingPower: _vote[8],
      bidsLength: _vote[9],
      winningBidId: _vote[10],
      bids: [],
      voters: []
    }
    if (vote.bidsLength > 0) {
      
      for (var i = 0; i < vote.bidsLength; i++) {
        const bid = await this.getBid(vote.id, i);
        vote.bids.push(bid);
      }
    }
    return vote;
  }

  async getBid(voteId: number, bidId: number): Promise<IBid> {
    if (!this.ProposalContract) {
      console.log('Proposal Contract not active')
      return;
    }
    try {
      const _bid = await this.ProposalContract.getBid(voteId, bidId);
      return {
        name: _bid[0],
        beneficiary: _bid[1],
        active: _bid[2],
        cost: _bid[3],
        ifpshash: _bid[4],
        voteCount: _bid[5]
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  async createBid(voteId: number, ipfshash: string, cost: number, name: string): Promise<any> {
    if (!this.ProposalContract) {
      console.log('Proposal Contract not active')
      return;
    }
    try {
      const costInWei = this.web3Service.ethToWei(cost);
      const tx = await this.ProposalContract.newBid.sendTransaction(voteId, ipfshash, costInWei, name, {from: this.web3Service.account})
      return tx;
    } catch (error) { 
      console.error(error);
    }
  }
}
