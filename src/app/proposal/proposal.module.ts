import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProposalRoutingModule} from './proposal-routing.module'
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule, 
  MatSnackBarModule,
  MatIconModule
} from '@angular/material';
import { VoteComponent } from './vote/vote.component';
import { BidComponent } from './bid/bid.component';
import { ProposalComponent } from "./proposal.component";
import { VoteDetailComponent } from './vote-detail/vote-detail.component';




@NgModule({
  declarations: [VoteComponent, BidComponent, ProposalComponent, VoteDetailComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule, 
    MatSnackBarModule,
    RouterModule,
    ProposalRoutingModule,
    MatIconModule
  ]
})
export class ProposalModule { }
