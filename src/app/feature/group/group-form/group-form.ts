import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-form',
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.html',
  styleUrl: './group-form.css',
})
export class GroupForm {
  groupForm: FormGroup = new FormGroup({
    groupName: new FormControl('', Validators.required),
    defaultCurrency: new FormControl('', Validators.required),
    creator: new FormControl('', Validators.required),
    members: new FormArray([new FormControl('', Validators.required)]),
  });

  get groupName() {
    return this.groupForm.get('groupName') as FormControl;
  }

  get defaultCurrency() {
    return this.groupForm.get('defaultCurrency') as FormControl;
  }

  get creator() {
    return this.groupForm.get('creator') as FormControl;
  }

  get members() {
    return this.groupForm.get('members') as FormArray;
  }
}
