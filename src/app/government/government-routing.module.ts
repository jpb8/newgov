import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GovernmentDetailComponent } from './government-detail/government-detail.component';

const routes: Routes = [
  {path: '', component: GovernmentDetailComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GovernmentRoutingModule { }