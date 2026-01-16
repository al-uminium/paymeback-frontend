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
  private groupDetailsSignal = signal<GroupDetails>(emptyGroupDetails());
  readonly groupDetails = this.groupDetailsSignal.asReadonly();

  private members = signal<Member[]>([]);
  readonly sharedMembers = this.members.asReadonly();

  private route = inject(ActivatedRoute);
  private httpService = inject(HttpService);

  updateGroupDetails(groupDetails: GroupDetails): void {
    this.groupDetailsSignal.set(groupDetails);
  }

  updateMembers(members: Member[]) {
    this.members.set(members);
  }

  getGroupDetailsAndMembers(): GroupDetailsData {
    console.log(this.route.snapshot.paramMap);
    const token = this.route.snapshot.paramMap.get('token') as string;
    if (this.groupDetails().id === '') {
      this.httpService.getGroupDetails(token, true).subscribe({
        next: (data: GroupDetailsData) => {
          this.updateGroupDetails(data.groupDetails);
          this.updateMembers(data.members);
        },
      });
    }
    console.log('Checking if it actually updated');
    console.log(this.groupDetails());
    return {
      groupDetails: this.groupDetails(),
      members: this.members(),
    };
  }
}
