import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from '../../../../shared';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
@Component({
  selector: 'dwlz-gates',
  templateUrl: './gates.component.html',
})
export class GatesComponent implements OnInit {

  gatesForm: FormGroup;
  isEdit: boolean;
  editData;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GatesComponent>,
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
    this.formInit();
    if (this.data) {
      this.gatesForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  formInit() {
    this.gatesForm = this.fb.group({
      sg_socid: [this.appState.societyId],
      sg_id: [''],
      sg_name: ['', Validators.required],
      sg_desc: ['', Validators.required],
      sg_isactive: ['Y', Validators.required],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  onSubmit() {
    if (this.gatesForm.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.gatesForm.value)
      };
      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newGates(formData).subscribe(response => {
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
    this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    }).afterClosed().subscribe(res => {
      if (res === true) {
        data = {
          socID: this.appState.societyId,
          sg_id: this.gatesForm.get('sg_id').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteGates(formdata).subscribe(response => {
          this.closeForm(true, true);
          this.snackBar.openSnacBar('Data Deleted Successfully');
        });
      } else {
        this.closeForm(true);
      }


    });
  } // End of onDelete
}
