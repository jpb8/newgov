import { Component, OnInit, Input } from '@angular/core';
import { GovernmentService } from '../../government/government.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() members: string[];

  newMembers: string[];
  newMemberName: string;
  boardTokenName: string;
  boardTokenSymbol: string;
  boardMembers: string[];
  totalBoardMembers: number;


  constructor(private governmentService: GovernmentService) { }

  ngOnInit() {
    if (this.governmentService.government) {
      this.boardMembers = this.governmentService.government.boardMembers;
      this.totalBoardMembers = this.governmentService.government.totalBoardMembers;
    }
    this.newMembers = [];
  }

  addBoardMember(memberAddress: string) {
    this.newMembers.push(this.newMemberName);
    this.newMemberName = '';
  }

  createBoard() {
    this.governmentService.createBoard(this.boardTokenName, this.boardTokenSymbol, this.newMembers);
  }

  setNewMemberName(e) {
    this.newMemberName = e.target.value;
  }

  setTokenSymbol(e) {
    this.boardTokenSymbol = e.target.value;
  }

  setTokenName(e) {
    this.boardTokenName = e.target.value;
  }

}