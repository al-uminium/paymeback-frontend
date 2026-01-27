import { Component, computed, inject, OnInit } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCIES } from '../../../shared/models/currency';
import { JsonPipe } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state-service';

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

  expenseForm!: FormGroup;

  ngOnInit(): void {
    if (this.appState.groupDetails() !== undefined) {
      console.log('ran this instead');
      this.initializeForm();
    } else {
      const token = this.route.snapshot.paramMap.get('token') as string;
      this.appState.getGroupDetailsAndMembers(token);
      console.log('ran this');
      computed(() => {
        if (this.appState.groupDetails() !== undefined) {
          this.initializeForm();
        }
      });
    }
  }

  // need to figure out a way to pass group ID, members and current user to this component
  initializeForm(): void {
    this.expenseForm = new FormGroup({
      expenseName: new FormControl('', Validators.required),
      payer: new FormControl('', Validators.required),
      totalCost: new FormControl('', Validators.required),
      currency: new FormControl(this.appState.groupDetails()!.defaultCurrency, Validators.required),
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
