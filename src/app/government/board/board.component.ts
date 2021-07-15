import { Component, OnInit, Input } from '@angular/core';
import { GovernmentService } from '../../government/government.service';
import { IToken } from '../../shared/models/token';
import { IBoardMember } from '../../shared/models/government';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() members: string[];

  // newMembers: string[];
  newMemberName: string;
  newBoardTokenName: string;
  newBoardTokenSymbol: string;
  boardMembers: IBoardMember[];
  totalBoardMembers: number;
  boardToken: IToken;
  boardForm: FormGroup;
  memberForm: FormGroup;


  constructor(
    private governmentService: GovernmentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.governmentService.government) {
      this.boardMembers = this.governmentService.government.boardMembers;
      this.totalBoardMembers = this.governmentService.government.totalBoardMembers;
      if (this.governmentService.boardToken) {
        this.boardToken = this.governmentService.boardToken;
      }
    }
    this.createBoardForm();
    // this.createMemberForm();
    this.newMemberName = '';
  }

  // createMemberForm() {
  //   this.memberForm = this.formBuilder.group({
  //     address: ['', Validators.required]
  //   })
  // }

  createBoardForm() {
    this.boardForm = this.formBuilder.group({
      tokenName: ['', Validators.required],
      token: ['', Validators.required],
      newMembers: this.formBuilder.array([[
        this.formBuilder.control('')
      ]])
    })
  }

  get newMembers() : FormArray {
    return this.boardForm.get("newMembers") as FormArray
  }

  addNewMember() {
    this.newMembers.push(this.formBuilder.control(''));
  }

  removeNewMember(i: number) {
    this.newMembers.removeAt(i);
  }

  // createBoard() {
  //   this.governmentService.createBoard(this.newBoardTokenName, this.newBoardTokenSymbol, this.newMembers);
  // }

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