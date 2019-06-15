import { Component, OnInit, Inject, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from './../../../../shared';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { DataTableComponent } from './../../../../shared';
@Component({
  selector: 'dwlz-wings',
  templateUrl: './wings.component.html',
})
export class WingsComponent implements OnInit {

  wingsForm: FormGroup;
  isEdit = false;
  editData;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WingsComponent>,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dialog: MatDialog,
    private appState: fromShared.AppState,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.openForm();
  }

  openForm() {
    if (this.data) {
      this.openEditForm(this.data); // function used for seprating editing Logic
    } else {
      this.formInit();
    }
  }

  private openEditForm(data) { // auto created
    this.formInit();
    this.wingsForm.patchValue(data);
    this.isEdit = true;
  }

  formInit() {
    this.wingsForm = this.fb.group({
      sw_socid: [this.appState.societyId],
      sw_id: [''],
      sw_name: ['', Validators.required],
      sw_floors: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(1), Validators.max(999)]],
      sw_flatsperfloor: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(1), Validators.max(999)]],
      sw_isactive: ['Y'],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  onSubmit() {
    if (this.wingsForm.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.wingsForm.value)
      };

      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newWings(formData).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.closeForm(true);
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  closeForm(ref, deleted?) {
    this.dialogRef.close({ refresh: ref, is_delete: deleted });
    this.editData = '';
  }

  onDelete(data): void {
    const deletedialog = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });

    deletedialog.afterClosed().subscribe(res => {

      if (res === true) {
        data = {
          socID: this.appState.societyId,
          sw_id: this.wingsForm.get('sw_id').value
        };

        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteWings(formdata).subscribe(response => {
          // deletedialog.close();
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
            this.closeForm(true);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
            this.closeForm(true, true);
          }
        });
      } else {
        deletedialog.close();
      }
    });
  } // End of onDelete

}
