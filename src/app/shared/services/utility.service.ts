import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  newFormDataArray(value) {
    const data = new FormData();
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        data.append(key, value[key]);
      }
    }
    return data;
  }
}
