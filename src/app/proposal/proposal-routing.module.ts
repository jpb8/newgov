import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProposalComponent } from './proposal.component';

const routes: Routes = [
  {path: '', component: ProposalComponent},
  {path: 'vote/:id', component: ProposalComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }