import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import * as fromShared from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private appState: fromShared.AppState,
    private api: fromShared.ApiService
  ) {}

  checkAuthentication() {
    if (this.appState.isAuthenticated) {
      return true;
    }
    this.appState.logOut();
    return false;
  }

  canLoad() {
    return this.checkAuthentication();
  }

  canActivate() {
    return this.checkAuthentication();
  }
}
