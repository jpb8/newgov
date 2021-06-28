import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';
import {GovernmentRoutingModule} from './government-routing.module'
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { GovernmentDetailComponent } from './government-detail/government-detail.component';
import { BoardComponent } from './board/board.component';
import { ProposalComponent } from '../proposal/proposal.component';


@NgModule({
  declarations: [GovernmentDetailComponent, BoardComponent, ProposalComponent],
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
    GovernmentRoutingModule
  ],
  exports: []
})
export class GovernmentModule { }
