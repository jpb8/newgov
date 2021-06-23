import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'government', loadChildren: () => import('./government/government.module').then(mod => mod.GovernmentModule)},
  {path: 'factory', loadChildren: () => import('./factory/factory.module').then(mod => mod.FactoryModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
