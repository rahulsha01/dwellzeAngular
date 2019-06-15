import { Injectable } from '@angular/core';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
// import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class PopupsService {
  constructor(
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar
  ) {}

  // openConfirmDialog() {
  //   const bottomSheetRef = this.bottomSheet.open(ConfirmationDialogComponent, {
  //     ariaLabel: 'Share on social media',
  //     panelClass: 'custom-width'
  //   });
  // }

  openSnacBar(message) {
    this.snackBar.open(message, 'OK', {
      duration: 3000
    });
  }
}
