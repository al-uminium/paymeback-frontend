import { Component, inject, OnInit } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  imports: [],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  expenseForm!: FormGroup;

  ngOnInit(): void {
    this.expenseForm = new FormGroup({
      expenseName: new FormControl('', Validators.required),
      totalCost: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      participants: new FormArray([]),
    });
  }

  // need to figure out a way to pass group ID, members and current user to this component

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
