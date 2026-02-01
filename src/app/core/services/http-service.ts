import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GroupDetailsData } from '../../shared/models/group-details.data';
import { Observable } from 'rxjs';
import { IExpenseData, ExpensePayload } from '../../shared/models/expense.data';
import { IAuditLogData } from '../../shared/models/audit-log.data';
import { IApiError } from '../../shared/models/error-data';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private BASE_URL: string = environment.apiUrl;

  private GROUP_API: string = 'api/group';
  private EXPENSE_API: string = 'api/expense';
  private MEMBER_API: string = 'api/member';

  createGroup(payload: any): Observable<GroupDetailsData> {
    return this.http.post<GroupDetailsData>(`/${this.GROUP_API}/create`, payload);
  }

  getGroupDetails(token: string, includeMembers: boolean): Observable<GroupDetailsData> {
    return this.http.get<GroupDetailsData>(
      `/${this.GROUP_API}/${token}?includeMembers=${includeMembers}`,
    );
  }

  getGroupExpenses(groupId: string): Observable<IExpenseData[]> {
    return this.http.get<IExpenseData[]>(`${this.GROUP_API}/${groupId}/expenses`);
  }

  createExpense(payload: ExpensePayload, actorId: string): Observable<IExpenseData> {
    return this.http.post<IExpenseData>(`${this.EXPENSE_API}/create`, payload, {
      headers: {
        'X-Actor-Id': actorId,
      },
    });
  }

  getGroupLogs(groupId: string): Observable<IAuditLogData[]> {
    return this.http.get<IAuditLogData[]>(`${this.GROUP_API}/${groupId}/logs`);
  }
}
