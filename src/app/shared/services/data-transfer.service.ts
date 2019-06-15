import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor() { }
  private _memId = new BehaviorSubject<any>('');
  private _meetingStatus = new BehaviorSubject<any>('');

  set memId(value) {
    this._memId.next(value);
  }
  get memId() {
    return this._memId.asObservable();
  }

  set meetingStatus(value) {
    this._meetingStatus.next(value);
  }

  get meetingStatus() {
    return this._meetingStatus.asObservable();
  }
}
