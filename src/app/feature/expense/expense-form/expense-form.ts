import { Component, computed, effect, inject, OnInit, Signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCIES } from '../../../shared/models/currency';
import { JsonPipe } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state-service';
import { GroupDetails, Member, User } from '../../../shared/models/group-details.data';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { FormField } from '@angular/forms/signals';
import {
  ExpensePayload,
  IExpenseData,
  ParticipantPayload,
} from '../../../shared/models/expense.data';
import { IApiError } from '../../../shared/models/error-data';
import { UserSelect } from '../../group/user-select/user-select';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  private httpService = inject(HttpService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private token!: string;

  readonly currencyList = CURRENCIES;

  appState = inject(AppStateService);
  localStorage = inject(LocalStorageService);

  currentUser: User | undefined = undefined;
  groupDetails!: GroupDetails;
  members!: Member[];
  expenseForm!: FormGroup;
  showSelectedParticipants: boolean = false;

  constructor() {
    this.token = this.route.snapshot.paramMap.get('token') as string;
    const effectRef = effect(() => {
      const groupDetails = this.appState.groupDetails();
      const members = this.appState.sharedMembers();
      const storedUser = this.localStorage.getUserOfGroup(this.token);
      if (storedUser === undefined) {
        this.navigateToDashboard();
      } else {
        this.currentUser = storedUser;
      }
      if (groupDetails && members) {
        this.initializeForm(groupDetails);
        this.groupDetails = groupDetails;
        this.members = members;
        this.payer.patchValue(this.currentUser?.name);
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
        this.appState.getGroupDetailsAndMembers(this.token);
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

  initializeForm(groupDetails: GroupDetails): void {
    this.expenseForm = new FormGroup({
      expenseName: new FormControl('', Validators.required),
      payer: new FormControl('', Validators.required),
      totalCost: new FormControl('', Validators.required),
      currency: new FormControl(groupDetails.defaultCurrency, Validators.required),
      date: new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
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
    const user = this.localStorage.getUserOfGroup(this.token);

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
      if (participant.get('name')!.value !== this.payer.value) {
        const isChecked = participant.get('isChecked') as FormControl;
        isChecked.patchValue(true);
      }
    }
  }

  handleParticipantSubmit() {
    this.showSelectedParticipants = true;
  }

  findUserByName(name: string): Member {
    return this.members.find((member) => member.name === name)!;
  }

  navigateToDashboard() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onSubmit() {
    const participants: ParticipantPayload[] = [];
    const payer = this.findUserByName(this.payer.value);

    if (this.currentUser) {
      for (const member of this.participants.controls) {
        if (payer.id !== member.get('id')!.value) {
          const participant: ParticipantPayload = {
            participantId: member.get('id')!.value,
            amountOwed: member.get('amt')?.value as number,
          };
          participants.push(participant);
        }
      }
      const expensePayload: ExpensePayload = {
        expenseName: this.expenseName.value,
        groupId: this.groupDetails.id,
        ownerId: payer.id!,
        totalCost: this.totalCost.value as number,
        splitType: this.splitType.value ? 'EVEN' : 'CUSTOM',
        currency: this.currency.value,
        date: this.date.value,
        participants: participants,
      };

      this.httpService.createExpense(expensePayload, this.currentUser.id).subscribe({
        next: (data: IExpenseData) => {
          console.log(data);
          this.navigateToDashboard();
        },
        error: (err: IApiError) => {
          console.debug(err);
        },
      });
    } else {
      console.debug('No actor ID found.');
    }
  }
}
