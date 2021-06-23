import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { GovernmentService } from '../government/government.service';

declare let require: any;
const government_factory_artifacts = require('../../../build/contracts/GovernmentFactory.json');


@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {
  accounts: string[];
  GovernmentFactory: any;
  totalGovernments: number;
  governments: string[];
  account: string;
  name: string;

  constructor(
    private web3Service: Web3Service, 
    private matSnackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.watchAccount();
    console.log(government_factory_artifacts);
    this.web3Service.artifactsToContract(government_factory_artifacts)
      .then((GovernmentFactoryAbstraction) => {
        this.GovernmentFactory = GovernmentFactoryAbstraction;
        this.getTotalGovernments().then(() => {
          this.getGovernments();
        });
      });
  }

  async getTotalGovernments() {
    if (!this.GovernmentFactory) {
      this.setStatus('No Gov Fac');
      return;
    }
    try {
      console.log(this.GovernmentFactory);
      const deployedGovFactory = await this.GovernmentFactory.deployed();
      console.log(deployedGovFactory);
      this.totalGovernments = await deployedGovFactory.totalGovernments();

      if (!this.totalGovernments) {
        console.log('Error getting total govs');
      } else {
        console.log('Total Govs: ' + this.totalGovernments);
      }

    } catch (e) {
      console.log(e);
      this.setStatus('Error getting total govs')
    }
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  async getGovernments() {
    const deployedGovFactory = await this.GovernmentFactory.deployed();
    console.log('get governments')
    console.log(this.totalGovernments);
    this.governments = [];
    for (var i = 0; i <= this.totalGovernments; i++) {
      const government = await deployedGovFactory.governments(i);
      if (government != '0x0000000000000000000000000000000000000000') {
        this.governments.push(government);
        console.log(government);
      }
    }
  }

  public async createGovernment() {
    if (!this.GovernmentFactory) {
      this.setStatus('No Gov Fac');
      return;
    }
    if (!this.name) {
      this.setStatus('Please Supply a Name');
      return;
    }
    console.log('Creating Gov: ' + this.name + ' from account: ' + this.account)

    try {
      const deployedGovFactory = await this.GovernmentFactory.deployed();
      const newGov = await deployedGovFactory.newGovernment.sendTransaction(this.name, {from: this.account});
        
      console.log(newGov);
      if (!newGov) {
        console.log('Error Creating new gov asdf asdf');
      } else {
        console.log('New Gov: ' + newGov);
      }
      this.getTotalGovernments();

    } catch (e) {
      console.log(e);
      this.setStatus('Error Creating new gov')
    }
  }

  setName(e) {
    this.name = e.target.value;
  }

  

}
