import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { GroupDetails, GroupDetailsData, Member } from '../../../shared/models/group-details.data';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../expense/expense';
import { HistoryDashboard } from '../history-dashboard/history-dashboard';
import { LucideAngularModule, Settings, UserRoundCog } from 'lucide-angular';
import { AppStateService } from '../../../core/services/app-state-service';

@Component({
  selector: 'app-dashboard',
  imports: [Expense, HistoryDashboard, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);
  private appState = inject(AppStateService);

  readonly UserRoundCog = UserRoundCog;

  readonly Settings = Settings;

  readonly groupDetails!: GroupDetails;
  readonly members!: Member[];

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    const groupDetailsData = this.appState.getGroupDetailsAndMembers();
    console.log(groupDetailsData);
  }
}
