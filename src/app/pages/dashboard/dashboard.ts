import { Component, inject, OnInit } from '@angular/core';
import { HttpService } from '../../core/services/http-service';
import { LocalStorageService } from '../../core/services/local-storage-service';
import { GroupDetails, GroupDetailsData, Member } from '../../shared/models/group-details.data';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseData } from '../../shared/models/expense.data';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private httpService = inject(HttpService);
  private localStorageService = inject(LocalStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  groupDetails!: GroupDetails;
  groupMembers!: Member[];
  currentUser: Member | undefined = undefined;
  expenses: ExpenseData[] = [];

  ngOnInit(): void {
    // retrieve group details
    // retrieve expense details
    // others will be retrieved on switching tab.
    const token = this.route.snapshot.paramMap.get('token') as string;
    const storedUser = this.localStorageService.getUserOfGroup(token);

    this.httpService
      .getGroupDetails(token, true)
      .pipe(
        tap((response: GroupDetailsData) => {
          this.groupDetails = response.groupDetails;
          this.groupMembers = response.members;
          console.info(storedUser);
          if (storedUser !== undefined) {
            console.info('Local storage for user found, attempting to set currentUser');
            this.currentUser = this.groupMembers.find((member) => member.id === storedUser.id);
          }
        }),
        switchMap((response: GroupDetailsData) => {
          return this.httpService.getGroupExpenses(response.groupDetails.id);
        }),
      )
      .subscribe({
        next: (response: ExpenseData[]) => {
          this.expenses = response;
        },
        error: (err) => console.error(err),
      });
  }
}
