import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {Web3Service} from '../../util/web3.service';
import { IGovernment } from '../../shared/models/government'
import { GovernmentService } from '../../government/government.service';


declare let require: any;
const government_artifacts = require('../../../../build/contracts/Government.json');

@Component({
  selector: 'app-government-item',
  templateUrl: './government-item.component.html',
  styleUrls: ['./government-item.component.css']
})
export class GovernmentItemComponent implements OnInit {
  @Input() governmentAddress: string;
  
  government: IGovernment;
  GovernmentContract: any;
  name: string;

  constructor(
    private web3Service: Web3Service, 
    private matSnackBar: MatSnackBar,
    private governmentService: GovernmentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.web3Service.abiAndAddressToContract(government_artifacts.abi, this.governmentAddress)
      .then((GovernmentAbstraction) => {
        this.GovernmentContract = GovernmentAbstraction;
        this.getGovernment();
      });
  }

  async getGovernment() {
    if (!this.GovernmentContract) {
      return;
    }
    // const deployedGovernment = await this.GovernmentContract.deployed();
    this.name = await this.GovernmentContract.methods.name().call();
    
  }

  async setGovernmentAddress(address: string) {
    if (!this.GovernmentContract) {
      return;
    }
    await this.governmentService.setGovernmentAddress(address);
    this.router.navigate(['/government']);
  }

}
