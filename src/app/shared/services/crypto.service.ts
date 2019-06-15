import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  salt = environment.salt;

  encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.salt);
  }

  decrypt(data) {
    try {
      const unprocessedData = CryptoJS.AES.decrypt(data, this.salt);
      return JSON.parse(unprocessedData.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return false;
    }
  }

}
