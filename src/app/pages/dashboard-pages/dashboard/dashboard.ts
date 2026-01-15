import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { GroupDetailsData } from '../../../shared/models/group-details.data';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../expense/expense';
import { HistoryDashboard } from '../history-dashboard/history-dashboard';
import { LucideAngularModule, Settings, UserRoundCog } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [Expense, HistoryDashboard, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);

  readonly UserRoundCog = UserRoundCog;

  readonly Settings = Settings;

  groupDetailsData = signal<GroupDetailsData | undefined>(undefined);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    this.httpService.getGroupDetails(token, true).subscribe({
      next: (data: GroupDetailsData) => {
        this.groupDetailsData.set(data);
      },
    });
  }
}
