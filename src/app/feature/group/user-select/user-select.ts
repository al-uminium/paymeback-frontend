import { Component, input, output } from '@angular/core';
import { Member } from '../../../shared/models/group-details.data';

@Component({
  selector: 'app-user-select',
  imports: [],
  templateUrl: './user-select.html',
  styleUrl: './user-select.css',
})
export class UserSelect {
  //takes in Member[] or {name: name} array
  members = input<any[]>();
  userSelected = output();
  backBtnClicked = output();

  user: any; //prob need to refactor this.

  handleUserChoice(member: any) {
    this.user = member;
  }

  onSubmit() {
    this.userSelected.emit(this.user);
  }

  onBackClick() {
    this.backBtnClicked.emit();
  }
}
