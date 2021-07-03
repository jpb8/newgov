import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProposalComponent } from './proposal.component';
import { VoteDetailComponent } from './vote-detail/vote-detail.component';

const routes: Routes = [
  {path: '', component: ProposalComponent},
  {path: 'vote/:id', component: VoteDetailComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }