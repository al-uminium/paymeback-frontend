import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCIES } from '../../../shared/models/currency';

@Component({
  selector: 'app-group-form',
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.html',
  styleUrl: './group-form.css',
})
export class GroupForm implements OnInit {
  protected currencies = CURRENCIES;

  inputGroupForm = input<FormGroup>();
  groupFormCreated = output<FormGroup>();

  groupForm!: FormGroup;

  ngOnInit(): void {
    console.log(this.inputGroupForm());
    if (this.inputGroupForm() === undefined) {
      this.groupForm = new FormGroup({
        groupName: new FormControl('', Validators.required),
        defaultCurrency: new FormControl('', Validators.required),
        creator: new FormControl(''),
        members: new FormArray([new FormControl('', Validators.required)]),
      });
    } else {
      this.groupForm = this.inputGroupForm()!;
    }
  }

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

  getMemberAt(index: number): FormControl {
    return this.members.at(index) as FormControl;
  }

  addMember(): void {
    this.members.push(new FormControl('', Validators.required));
  }

  removeMemberAt(index: number): void {
    this.members.removeAt(index);
  }

  onSubmit(): void {
    this.groupFormCreated.emit(this.groupForm)
  }
}
