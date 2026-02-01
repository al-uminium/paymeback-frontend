import { Component, inject, OnInit } from '@angular/core';
import { GroupDetails, Member } from '../../../shared/models/group-details.data';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../expense/expense';
import { HistoryDashboard } from '../history-dashboard/history-dashboard';
import { LucideAngularModule, Settings, UserRoundCog } from 'lucide-angular';
import { AppStateService } from '../../../core/services/app-state-service';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { UserSelect } from '../../../feature/group/user-select/user-select';

@Component({
  selector: 'app-dashboard',
  imports: [UserSelect, Expense, HistoryDashboard, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  route = inject(ActivatedRoute);
  appState = inject(AppStateService);
  localStorage = inject(LocalStorageService);

  readonly UserRoundCog = UserRoundCog;

  readonly Settings = Settings;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    // calls to update appState
    if (
      this.appState.groupDetails() === undefined ||
      this.appState.groupDetails()?.linkToken !== token
    ) {
      this.appState.getGroupDetailsAndMembers(token);
    }
  }

  selectUser(user: any): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    this.localStorage.saveGroup(token, user);
  }
}
