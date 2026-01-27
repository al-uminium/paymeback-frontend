import { inject, Injectable, signal } from '@angular/core';
import {
  emptyGroupDetails,
  GroupDetails,
  GroupDetailsData,
  Member,
} from '../../shared/models/group-details.data';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './http-service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private groupDetailsSignal = signal<GroupDetails | undefined>(undefined);
  readonly groupDetails = this.groupDetailsSignal.asReadonly();

  private members = signal<Member[]>([]);
  readonly sharedMembers = this.members.asReadonly();

  private httpService = inject(HttpService);

  updateGroupDetails(groupDetails: GroupDetails): void {
    this.groupDetailsSignal.set(groupDetails);
  }

  updateMembers(members: Member[]) {
    this.members.set(members);
  }

  getGroupDetailsAndMembers(token: string): void {
    if (this.groupDetails() === undefined) {
      this.httpService.getGroupDetails(token, true).subscribe({
        next: (data: GroupDetailsData) => {
          this.updateGroupDetails(data.groupDetails);
          this.updateMembers(data.members);
        },
      });
    }
  }
}
