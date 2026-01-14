import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { GroupDetails, GroupDetailsData, Member } from '../../../shared/models/group-details.data';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../expense/expense';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [Expense],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);

  groupDetails = signal<GroupDetailsData | undefined>(undefined);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    this.httpService.getGroupDetails(token, true).subscribe({
      next: (data: GroupDetailsData) => {
        this.groupDetails.set(data);
      },
    });
  }
}
