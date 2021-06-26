import { Component, OnInit } from '@angular/core';
import { GovernmentService } from '../../government/government.service';
import { IGovernment } from '../../shared/models/government'

@Component({
  selector: 'app-government-detail',
  templateUrl: './government-detail.component.html',
  styleUrls: ['./government-detail.component.css']
})
export class GovernmentDetailComponent implements OnInit {
  government: IGovernment;
  members: string[];

  constructor(
    private governmentService: GovernmentService
  ) { }

  ngOnInit() {
    if (!this.governmentService.government) {
      console.log('Government not initialized');
    }
    this.getGovernment();
  }

  getGovernment() {
    this.government = this.governmentService.government;
  }

  createBoard(addresses: string[]) {

  }

}
