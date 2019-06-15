import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './local-data.service';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AppState {
  private soc_name: string;
  private soc_id: string;
  constructor(
    private storage: StorageService,
    private crypto: CryptoService,
    private router: Router
  ) {}

  private _navigations: any = new BehaviorSubject<any>('');
  private _isLoggedIn: any = new BehaviorSubject<any>(false);

  set navigations(value) {
    this._navigations.next(value);
  }

  get navigations() {
    return this._navigations.asObservable();
  }

  set isLoggedIn(value) {
    this._isLoggedIn.next(value);
  }

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  get isAuthenticated() {
    return this.checkAuthentication();
  }

  get societyName() {
    return this.soc_name ? this.soc_name : this.getSocName();
  }

  get societyId() {
    return this.soc_id ? this.soc_id : this.getSocId();
  }

  private checkAuthentication() {
    const localStorage = this.storage.getStorage('dwellze-soc-admin');
    if (localStorage && this.crypto.decrypt(localStorage.toString())) {
      this._isLoggedIn.next(true);
      return true;
    } else {
      this._isLoggedIn.next(false);
      // this.logOut();
      return false;
    }
  }

  private getSocName() {
    const localStorage = this.storage.getStorage('dwellze-soc-admin');
    if (localStorage && this.crypto.decrypt(localStorage.toString())) {
      const data = this.crypto.decrypt(localStorage.toString());
      return data.so_name;
    }
    return '';
  }

  private getSocId() {
    const localStorage = this.storage.getStorage('dwellze-soc-admin');
    if (localStorage && this.crypto.decrypt(localStorage.toString())) {
      const data = this.crypto.decrypt(localStorage.toString());
      return data.so_societyid;
    }
    return '';
  }

  logOut() {
    const localData = this.storage.getStorage('dwellze-soc-admin');
    if (localData) {
      this.storage.removeStorage('dwellze-soc-admin');
    }
    this.router.navigate(['/login']);
  }
}
