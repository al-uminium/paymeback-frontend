import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ExpenseCard } from '../../../feature/expense/expense-card/expense-card';
import { GroupDetails } from '../../../shared/models/group-details.data';
import { HttpService } from '../../../core/services/http-service';
import { IExpense, IExpenseData } from '../../../shared/models/expense.data';

@Component({
  selector: 'app-expense',
  imports: [ExpenseCard],
  templateUrl: './expense.html',
  styleUrl: './expense.css',
})
export class Expense implements OnInit {
  groupDetails = input.required<GroupDetails>();

  private httpService = inject(HttpService);

  expenseList = signal<IExpenseData[]>([]);

  ngOnInit(): void {
    console.log('init is running!');
    this.httpService.getGroupExpenses(this.groupDetails().id).subscribe({
      next: (data: IExpenseData[]) => {
        this.expenseList.set(data);
        console.log(this.expenseList);
      },
      error: (err) => {
        console.debug(err);
      },
    });
  }
}
