import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import * as fromShared from '../../shared';


@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate, CanLoad {

  constructor(
    private appState: fromShared.AppState,
    private api: fromShared.ApiService,
    private router: Router,
  ) {}

  checkLoggedIn() {
    if (!this.appState.isAuthenticated) {
      return true;
    }
    this.router.navigate(['/master']);
    return false;
  }

  canActivate() {
    return this.checkLoggedIn();
  }

  canLoad() {
    return this.checkLoggedIn();
  }
}
