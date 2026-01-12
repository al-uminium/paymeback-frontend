import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GroupDetailsData } from '../../shared/models/group-details.data';
import { Observable } from 'rxjs';

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
    return this.http.get<GroupDetailsData>(`${this.BASE_URL}/${this.GROUP_API}/create`)
  }
}
