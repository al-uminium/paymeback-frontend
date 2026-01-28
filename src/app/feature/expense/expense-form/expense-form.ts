import { Component, computed, effect, inject, OnInit, Signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCIES } from '../../../shared/models/currency';
import { JsonPipe } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state-service';
import { GroupDetails, Member } from '../../../shared/models/group-details.data';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, JsonPipe, FormField],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  private httpService = inject(HttpService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly currencyList = CURRENCIES;

  appState = inject(AppStateService);
  localStorage = inject(LocalStorageService);

  groupDetails!: GroupDetails;
  members!: Member[];
  expenseForm!: FormGroup;
  showSelectedParticipants: boolean = false;

  constructor() {
    const token = this.route.snapshot.paramMap.get('token') as string;
    const effectRef = effect(() => {
      const groupDetails = this.appState.groupDetails();
      const members = this.appState.sharedMembers();
      if (groupDetails && members) {
        this.initializeForm(groupDetails);
        this.groupDetails = groupDetails;
        this.members = members;
        this.payer.patchValue(this.localStorage.getUserOfGroup(token));
        this.splitType.valueChanges.subscribe((val) => {
          for (const member of this.participants.controls) {
            if (val === false) {
              if (member.get('isChecked')!.value === true) {
                member.get('amt')?.setValidators(Validators.required);
              }
            } else {
              member.get('amt')?.clearValidators();
            }
          }
        });
      } else {
        this.appState.getGroupDetailsAndMembers(token);
      }
    });

    if (this.expenseForm) {
      effectRef.destroy();
    }
  }

  ngOnInit(): void {
    // if (this.appState.groupDetails() !== undefined) {
    //   console.log('ran this instead');
    //   this.initializeForm(this.appState.groupDetails()!);
    // } else {
    //   const token = this.route.snapshot.paramMap.get('token') as string;
    //   this.appState.getGroupDetailsAndMembers(token);
    //   effect(() => {
    //     this.initializeForm(this.appState.groupDetails()!);
    //   });
    //   console.log('ran this');
    // }
  }

  // need to figure out a way to pass group ID, members and current user to this component
  initializeForm(groupDetails: GroupDetails): void {
    this.expenseForm = new FormGroup({
      expenseName: new FormControl('', Validators.required),
      payer: new FormControl('', Validators.required),
      totalCost: new FormControl('', Validators.required),
      currency: new FormControl(groupDetails.defaultCurrency, Validators.required),
      date: new FormControl(''),
      participants: new FormArray([]),
      splitType: new FormControl(true, Validators.required),
    });

    const members = this.appState.sharedMembers();
    for (const member of members) {
      const memberDetails = new FormGroup({
        name: new FormControl(member.name),
        id: new FormControl(member.id),
        amt: new FormControl(''),
        isChecked: new FormControl(false),
      });
      this.participants.push(memberDetails);
    }
  }

  getCurrentUser(): string {
    const user = this.localStorage.getUserOfGroup(this.route.snapshot.paramMap.get('token')!);

    return user ? user.name : '';
  }

  get expenseName() {
    return this.expenseForm.get('expenseName') as FormControl;
  }

  get payer() {
    return this.expenseForm.get('payer') as FormControl;
  }

  get totalCost() {
    return this.expenseForm.get('totalCost') as FormControl;
  }

  get currency() {
    return this.expenseForm.get('currency') as FormControl;
  }

  get date() {
    return this.expenseForm.get('date') as FormControl;
  }

  get participants() {
    return this.expenseForm.get('participants') as FormArray;
  }

  get splitType() {
    return this.expenseForm.get('splitType') as FormControl;
  }

  getMemberName(index: number): string {
    const member = this.participants.at(index);
    return member.get('name')!.value;
  }

  getMemberIsChecked(index: number): boolean {
    const member = this.participants.at(index);
    return member.get('isChecked')!.value;
  }

  selectEveryone(): void {
    for (const participant of this.participants.controls) {
      const isChecked = participant.get('isChecked') as FormControl;
      isChecked.patchValue(true);
    }
  }

  handleParticipantSubmit() {
    this.showSelectedParticipants = true;
  }

  onSubmit() {}
}
