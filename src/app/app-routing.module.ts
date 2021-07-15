import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GovernmentGuard } from './core/guards/government.guard'
import { ProposalGuard } from './core/guards/proposal.guard';

const routes: Routes = [
  {path: 'government', loadChildren: () => import('./government/government.module').then(mod => mod.GovernmentModule), canActivate: [GovernmentGuard], canActivateChild: [GovernmentGuard]},
  {path: 'factory', loadChildren: () => import('./factory/factory.module').then(mod => mod.FactoryModule)},
  {path: 'proposal', loadChildren: () => import('./proposal/proposal.module').then(mod => mod.ProposalModule), canActivate: [ProposalGuard], canActivateChild: [ProposalGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [GovernmentGuard, ProposalGuard]
})
export class AppRoutingModule { }
