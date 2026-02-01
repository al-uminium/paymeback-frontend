import { Injectable } from '@angular/core';
import { Member, User } from '../../shared/models/group-details.data';
import { LocalStorageData } from '../../shared/models/local-storage.data';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setLinkToken(token: string) {
    localStorage.setItem('linkToken', token);
  }

  setCurrentUser(user: any) {
    localStorage.setItem('user', user);
  }

  saveGroup(token: string, user: Member) {
    const group = { [token]: { name: user.name, id: user.id } };
    const groupString = JSON.stringify(group);
    localStorage.setItem('groups', groupString);
  }

  private getLocalStorageData(): LocalStorageData | null {
    const string = localStorage.getItem('groups');
    return string ? (JSON.parse(string) as LocalStorageData) : null;
  }

  getUserOfGroup(token: string): User | undefined {
    const group = this.getLocalStorageData();
    if (group !== null) {
      return group[token];
    } else {
      return undefined;
    }
  }
}
