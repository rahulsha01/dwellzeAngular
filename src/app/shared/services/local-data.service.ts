import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setStorage(key, value) {
    localStorage.setItem(key, value);
  }

  getStorage(key) {
    return localStorage.getItem(key);
  }

  removeStorage(key) {
    localStorage.removeItem(key);
  }

}
