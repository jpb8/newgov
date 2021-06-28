import { Injectable } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {IGovernment} from '../shared/models/government';
import { IToken } from '../shared/models/token';
import { ProposalService } from '../proposal/proposal.service'

declare let require: any;
const contract = require('@truffle/contract');
const government_artifacts = require('../../../build/contracts/Government.json');
const token_artifacts = require('../../../build/contracts/MiniMeToken.json');


@Injectable({
  providedIn: 'root'
})
export class GovernmentService {
  public governmentAddress: string;
  public GovernmentContract: any;
  public government: IGovernment;
  public account: string;
  public accounts: string[];
  public BoardTokenContract: any;
  public boardToken: IToken;

  constructor(private web3Service: Web3Service, private proposalService: ProposalService) {
    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  async loadContract(address: string) {
    if(!address) {
      console.log('No address for government');
      return;
    }
    await this.web3Service.artifactAndAddressToContract(government_artifacts, address)
      .then((GovernmentAbstraction) => {
        this.GovernmentContract = GovernmentAbstraction;
        console.log(this.GovernmentContract);
        console.log('Truffle Contract');
      });
  }

  async loadGovernment() {
    if (!this.GovernmentContract) {
      console.log('No GovernmentContract');
    }
    const name = await this.GovernmentContract.name();
    const boardToken = await this.GovernmentContract.boardToken();
    const boardVoting = await this.GovernmentContract.boardVoting();
    const boardProposals = await this.GovernmentContract.boardProposals();
    const totalBoardMembers = await this.GovernmentContract.totalBoardMembers();
    
    const boardMembers = [];
    for (var i = 0; i <= totalBoardMembers; i++) {
      const boardMember = await this.GovernmentContract.boardMembers(i);
      
      if (boardMember != '0x0000000000000000000000000000000000000000') {
        boardMembers.push({address: boardMember, balance: 0});
      }
    }

    

    this.government = {
      name: name,
      boardToken: boardToken,
      boardVoting: boardVoting,
      boardProposals: boardProposals,
      boardMembers: boardMembers,
      totalBoardMembers: totalBoardMembers
    }

    if (boardToken && boardToken != '0x0000000000000000000000000000000000000000') {
      await this.getBoardTokenContract();
      await this.getBoardToken();
      await this.getBoardBalances();
    }

    if (boardProposals && boardProposals != '0x0000000000000000000000000000000000000000') {
      await this.proposalService.loadContract(boardProposals);
      await this.proposalService.loadProposal();
    }


  }

  async setGovernmentAddress(governmentAddress: string) {
    this.governmentAddress = await governmentAddress;
    await this.loadContract(governmentAddress);
    await this.loadGovernment();
  }

  async createBoard(tokenName: string, tokenSymbol: string, addresses: string[]) {
    if (!this.GovernmentContract) {
      console.log('Government Not initilized')
      return;
    }    
    var transaction = await this.GovernmentContract.methods.createBoard(tokenName, tokenSymbol, addresses).send({from: this.web3Service.account});
    console.log(transaction);
  }

  async getBoardTokenContract() {
    console.log('board token = ' + this.government.boardToken)
    if(!this.government || !this.government.boardToken || this.government.boardToken == '0x0000000000000000000000000000000000000000') {
      console.log('No Board Token Address');
      return;
    }
    await this.web3Service.artifactAndAddressToContract(token_artifacts, this.government.boardToken)
      .then((TokenAbstraction) => {
        this.BoardTokenContract = TokenAbstraction;
        console.log(this.BoardTokenContract);
        console.log('Truffle Contract');
      });
  }

  // Move this to Token Service??? 
  
  async getBoardToken() {
    if (!this.BoardTokenContract) {
      console.log('No Board Token Contract');
      return;
    }
    const tokenName = await this.BoardTokenContract.name();
    const tokenSymbol = await this.BoardTokenContract.symbol();
    console.log(tokenName);
    this.boardToken = {
      name: tokenName,
      symbol: tokenSymbol
    }
  }

  async getBoardBalances() {
    if (!this.BoardTokenContract || !this.government || !this.government.boardMembers) {
      console.log('No Board Token Contract');
      return;
    }
    for (var boardMember of this.government.boardMembers) {
      boardMember.balance = await this.BoardTokenContract.balanceOf(boardMember.address);
    }
  }

}
