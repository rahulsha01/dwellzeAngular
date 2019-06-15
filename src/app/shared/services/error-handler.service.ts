import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { PopupsService } from './popups.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(
    private popups: PopupsService, private zone: NgZone
  ) { }

  handleError(error) {
  console.log(error);
    if (error instanceof Error) {
      // this.snackBar.open('Data Cannot be Processed', 'ok');
      this.zone.run(() => {
        this.popups.openSnacBar('Data Cannot be Processeed');
      });

    } else {
      //  this.snackBar.open('Server Down. Please try again after sometime','ok');
      this.zone.run(() => {
        this.popups.openSnacBar('Server Down Please try again after sometime');
      });
    }
  }
}
