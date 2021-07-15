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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [GovernmentDetailComponent, BoardComponent],
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
    GovernmentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class GovernmentModule { }
