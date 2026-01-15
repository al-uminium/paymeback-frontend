import { Component, input } from '@angular/core';
import { IExpense, IParticipants } from '../../../shared/models/expense.data';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, PencilIcon } from 'lucide-angular';

@Component({
  selector: 'app-expense-card',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css',
})
export class ExpenseCard {
  expense = input.required<IExpense>();
  participants = input.required<IParticipants[]>();

  readonly EditIcon = PencilIcon;

  openExpenseCard() {}

  formatParticipants(): string {
    let str = '';

    for (let index = 0; index < this.participants().length; index++) {
      if (this.expense().ownerId !== this.participants()[index]!.id) {
        str += this.participants()[index].name;
        if (index < this.participants().length - 1) {
          str += ', ';
        }
      }
    }

    return str;
  }
}
