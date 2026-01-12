import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GroupDetailsData } from '../../shared/models/group-details.data';
import { Observable } from 'rxjs';
import { ExpenseData, ExpensePayload } from '../../shared/models/expense.data';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient)
  private BASE_URL: string = environment.apiUrl;

  private GROUP_API: string = 'api/group'
  private EXPENSE_API: string = 'api/expense'
  private MEMBER_API: string = 'api/member'

  createGroup(payload: any): Observable<GroupDetailsData> {
    return this.http.post<GroupDetailsData>(`/${this.GROUP_API}/create`, payload)
  }

  getGroupDetails(token: string, includeMembers: boolean): Observable<GroupDetailsData> {
    return this.http.get<GroupDetailsData>(`/${this.GROUP_API}/${token}?includeMembers=${includeMembers}`)
  }

  getGroupExpenses(groupId: string): Observable<ExpenseData[]> {
    return this.http.get<ExpenseData[]>(`${this.GROUP_API}/${groupId}/expenses`)
  }

  createExpense(payload: ExpensePayload, groupId: string, actorId: string): Observable<ExpenseData> {
    return this.http.post<ExpenseData>(`${this.EXPENSE_API}/create`, payload, {
      headers: {
        'X-Group-Id': groupId,
        'X-Actor-Id': actorId
      }
    })
  }
}
