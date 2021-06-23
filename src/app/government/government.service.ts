import { Injectable } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {IGovernment} from '../shared/models/government'

declare let require: any;
const government_artifacts = require('../../../build/contracts/Government.json');


@Injectable({
  providedIn: 'root'
})
export class GovernmentService {
  public governmentAddress: string;
  public GovernmentContract: any;
  public government: IGovernment;
  public account: string;
  public accounts: string[];

  constructor(private web3Service: Web3Service) { 
    this.loadContract();
    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  loadContract() {
    console.log('Address: ' + this.governmentAddress)
    console.log(government_artifacts);
    if(!this.governmentAddress) {
      console.log('No address for government')
    }
    console.log(this.web3Service);
    this.web3Service.abiAndAddressToContract(government_artifacts.abi, this.governmentAddress)
      .then((GovernmentAbstraction) => {
        this.GovernmentContract = GovernmentAbstraction;
      });
  }

  async loadGovernment() {
    if (!this.GovernmentContract) {
      return;
    }
    console.log(this.GovernmentContract);
    const name = await this.GovernmentContract.methods.name().call();
    const boardToken = await this.GovernmentContract.methods.boardToken().call();
    const boardVoting = await this.GovernmentContract.methods.boardVoting().call();
    const boardProposals = await this.GovernmentContract.methods.boardProposals().call();
    const totalBoardMembers = await this.GovernmentContract.methods.totalBoardMembers().call();
    const boardMembers = [];
    for (var i = 0; i <= totalBoardMembers; i++) {
      console.log(i);
      const boardMember = await this.GovernmentContract.methods.boardMembers(i).call();
      
      if (boardMember != '0x0000000000000000000000000000000000000000') {
        boardMembers.push(boardMember);
        console.log(boardMember);
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
  }

  async setGovernmentAddress(governmentAddress: string) {
    this.governmentAddress = await governmentAddress;
    await this.loadContract();
    await this.loadGovernment();
  }

  async createBoard(tokenName: string, tokenSymbol: string, addresses: string[]) {
    if (!this.GovernmentContract) {
      console.log('Government Not initilized')
      return;
    }
    console.log(this.account);
    console.log('Token Symbol: ' + tokenSymbol);
    console.log(this.GovernmentContract);
    
    var transaction = await this.GovernmentContract.methods.createBoard(tokenName, tokenSymbol, addresses).send({from: this.web3Service.account});
    console.log(transaction);
  }

}
