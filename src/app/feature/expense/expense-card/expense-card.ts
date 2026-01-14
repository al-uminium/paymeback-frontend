import { Component, input } from '@angular/core';
import { IExpense, IParticipants } from '../../../shared/models/expense.data';

@Component({
  selector: 'app-expense-card',
  imports: [],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css',
})
export class ExpenseCard {
  expense = input.required<IExpense>();
  participants = input.required<IParticipants[]>();

  openExpenseCard() {}
}
