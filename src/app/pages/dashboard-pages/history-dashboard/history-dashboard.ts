import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../core/services/http-service';
import { GroupDetails } from '../../../shared/models/group-details.data';
import { IAuditLogData } from '../../../shared/models/audit-log.data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history-dashboard',
  imports: [DatePipe],
  templateUrl: './history-dashboard.html',
  styleUrl: './history-dashboard.css',
})
export class HistoryDashboard implements OnInit {
  private httpService = inject(HttpService);

  groupDetails = input.required<GroupDetails>();

  history = signal<IAuditLogData[]>([]);

  ngOnInit(): void {
    this.httpService.getGroupLogs(this.groupDetails().id).subscribe({
      next: (response: IAuditLogData[]) => {
        this.history.set(response);
      },
    });
  }
}
