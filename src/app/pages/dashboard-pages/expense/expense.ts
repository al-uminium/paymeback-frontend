import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ExpenseCard } from '../../../feature/expense/expense-card/expense-card';
import { GroupDetails } from '../../../shared/models/group-details.data';
import { HttpService } from '../../../core/services/http-service';
import { IExpense, IExpenseData } from '../../../shared/models/expense.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  imports: [ExpenseCard],
  templateUrl: './expense.html',
  styleUrl: './expense.css',
})
export class Expense implements OnInit {
  groupDetails = input.required<GroupDetails>();

  private httpService = inject(HttpService);

  private router = inject(Router);

  expenseList = signal<IExpenseData[]>([]);

  ngOnInit(): void {
    this.httpService.getGroupExpenses(this.groupDetails().id).subscribe({
      next: (data: IExpenseData[]) => {
        this.expenseList.set(data);
      },
      error: (err) => {
        console.debug(err);
      },
    });
  }

  routeToExpenseForm(): void {
    this.router.navigate(['/expense']);
  }
}
