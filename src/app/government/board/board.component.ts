import { Component, OnInit, Input } from '@angular/core';
import { GovernmentService } from '../../government/government.service';
import { IToken } from '../../shared/models/token';
import { IBoardMember } from '../../shared/models/government';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() members: string[];

  newMembers: string[];
  newMemberName: string;
  newBoardTokenName: string;
  newBoardTokenSymbol: string;
  boardMembers: IBoardMember[];
  totalBoardMembers: number;
  boardToken: IToken;


  constructor(private governmentService: GovernmentService) { }

  ngOnInit() {
    if (this.governmentService.government) {
      this.boardMembers = this.governmentService.government.boardMembers;
      this.totalBoardMembers = this.governmentService.government.totalBoardMembers;
      if (this.governmentService.boardToken) {
        this.boardToken = this.governmentService.boardToken;
      }
    }
    this.newMembers = [];
  }

  addBoardMember(memberAddress: string) {
    this.newMembers.push(this.newMemberName);
    this.newMemberName = '';
  }

  createBoard() {
    this.governmentService.createBoard(this.newBoardTokenName, this.newBoardTokenSymbol, this.newMembers);
  }

  setNewMemberName(e) {
    this.newMemberName = e.target.value;
  }

  setTokenSymbol(e) {
    this.newBoardTokenSymbol = e.target.value;
  }

  setTokenName(e) {
    this.newBoardTokenName = e.target.value;
  }

}