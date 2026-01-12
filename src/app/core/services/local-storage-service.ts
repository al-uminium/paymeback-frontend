import { Injectable } from '@angular/core';
import { Member, User } from '../../shared/models/group-details.data';
import { LocalStorageData } from '../../shared/models/local-storage.data';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setLinkToken(token: string) {
    localStorage.setItem("linkToken", token)
  }

  setCurrentUser(user: any) {
    localStorage.setItem("user", user)
  }

  saveGroup(token: string, user: Member) {
    const group = { [token]: { "name": user.name, "id": user.id } }
    const groupString = JSON.stringify(group);
    localStorage.setItem("groups", groupString)
  }

  getUserOfGroup(token: string): User | undefined {
    const groupString = localStorage.getItem("groups")
    if (groupString !== null) {
      const groupJson = JSON.parse(groupString) as LocalStorageData;
      return groupJson[token];
    } else {
      return undefined;
    }
  }
}
