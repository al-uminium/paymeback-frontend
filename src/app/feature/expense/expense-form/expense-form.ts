import { Component, computed, effect, inject, OnInit, Signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCIES } from '../../../shared/models/currency';
import { JsonPipe } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state-service';
import { GroupDetails } from '../../../shared/models/group-details.data';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  private httpService = inject(HttpService);
  private router = inject(Router);
  readonly currencyList = CURRENCIES;
  private route = inject(ActivatedRoute);
  appState = inject(AppStateService);

  groupDetails: Signal<GroupDetails | undefined> = this.appState.groupDetails;

  expenseForm!: FormGroup;

  constructor() {
    const token = this.route.snapshot.paramMap.get('token') as string;
    const effectRef = effect(() => {
      const groupDetails = this.appState.groupDetails();
      if (groupDetails) {
        this.initializeForm(groupDetails);
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
      date: new FormControl('', Validators.required),
      participants: new FormArray([]),
      splitType: new FormControl('', Validators.required),
    });

    const members = this.appState.sharedMembers();
    for (const member of members) {
      this.participants.push(
        new FormGroup({
          name: new FormControl(member.name),
          id: new FormControl(member.id),
          amt: new FormControl(''),
        }),
      );
    }
  }

  get expenseName() {
    return this.expenseForm.get('expenseName') as FormControl;
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

  onSubmit() {}
}
