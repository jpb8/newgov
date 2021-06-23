import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilModule} from '../util/util.module';
import { FactoryRoutingModule } from './factory-routing.module'
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule, 
  MatSnackBarModule
} from '@angular/material';
import { FactoryComponent } from './factory.component';
import { GovernmentItemComponent } from './government-item/government-item.component';


@NgModule({
  declarations: [FactoryComponent, GovernmentItemComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    FactoryRoutingModule
  ],
  exports: [FactoryComponent]
})
export class FactoryModule { }
