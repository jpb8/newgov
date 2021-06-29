import { Component, OnInit, Input } from '@angular/core';
import { IVote } from '../../shared/models/proposal';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  @Input() vote: IVote;
  constructor() { }

  ngOnInit() {
  }

}
