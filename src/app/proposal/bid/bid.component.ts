import { Component, OnInit, Input } from '@angular/core';
import { IBid } from '../../shared/models/proposal';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  @Input() bid: IBid;
  constructor() { }

  ngOnInit() {
  }

}
