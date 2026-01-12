import { Component, inject } from '@angular/core';
import { GroupForm } from '../../feature/group/group-form/group-form';
import { LocalStorageService } from '../../core/services/local-storage-service';
import { HttpService } from '../../core/services/http-service';
import { UserSelect } from '../../feature/group/user-select/user-select';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GroupDetailsData, Member } from '../../shared/models/group-details.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  imports: [GroupForm, UserSelect],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup {

  private localStorageService = inject(LocalStorageService);
  private httpService = inject(HttpService);
  private router = inject(Router);

  showSelectUser: boolean = false;
  members: any[] = [];
  groupForm: FormGroup | undefined = undefined;

  onGroupFormCreated(groupForm: FormGroup) {
    this.groupForm = groupForm;
    const memberFA = groupForm.get('members') as FormArray;
    memberFA.controls.forEach(memberControl => {
      this.members.push({ name: memberControl.value })
    });
    this.showSelectUser = true;
  }

  onCreatorSelected(user: any) {
    const creator = this.groupForm!.get('creator') as FormControl;
    creator.setValue(user.name);
    console.log(this.groupForm!.value);
    this.createGroup(user.name);
  }

  hideSelectUser(): void {
    this.showSelectUser = false;
    this.members = [];
  }

  createGroup(creator: string) {
    const members: any[] = [];

    if (this.groupForm === undefined) {
      // TODO handle error.
    } else {
      const memberControls = this.groupForm.get('members') as FormArray;
      memberControls.controls.forEach((member) => {
        members.push({
          name: member.value,
        });
      });

      const payload = {
        groupName: this.groupForm.get('groupName')!.value,
        defaultCurrency: this.groupForm.get('defaultCurrency')!.value,
        creator: {
          name: this.groupForm.get('creator')!.value,
        },
        members: members,
      };
      this.httpService.createGroup(payload).subscribe({
        next: (data: GroupDetailsData) => {
          const user = data.members.find(({ name }) => name === creator) as Member;
          this.localStorageService.saveGroup(data.groupDetails.linkToken, user)
          this.router.navigateByUrl(`group/${data.groupDetails.linkToken}`);
        },
      });
      console.log(payload)
    }


  }
}
