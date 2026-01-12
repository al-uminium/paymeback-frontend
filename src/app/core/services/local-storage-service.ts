import { Injectable } from '@angular/core';

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
}
