import { Component, OnInit, Injectable, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from '../../../../shared';
import { MatConfirmDialogComponent } from '../../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { DataTransferService } from '../../../../shared';
import { toArray } from 'rxjs/operators';
import * as _moment from 'moment';
const moment = _moment;
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'dwlz-staff',
  templateUrl: './staff.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class StaffComponent implements OnInit {

  staffForm: FormGroup;
  isEdit: boolean;
  status: boolean;
  action: string;
  memId: any;
  staffJsonArray = [];
  @ViewChild('picker1') startpicker;
  imageFiles = [];
  imgUpload = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StaffComponent>,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dialog: MatDialog,
    private dataTransfer: DataTransferService,
    private appState: fromShared.AppState,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getMemId();
    this.openForm();
  }

  openForm() {
    this.formInit();
    if (this.data) {
      this.emitSelectedStaff(this.data);
    }
  }

  getMemId() {
    this.dataTransfer.memId.subscribe(response => {
      this.memId = response;
    });
  }

  formInit() {
    this.staffForm = this.fb.group({
      ms_staffid: [''],
      ms_socid: [this.appState.societyId],
      ms_pmid: [this.memId],
      sv_date: [''],
      sv_time: [''],
      sv_cat: [''],
      sv_name: [''],
      sv_mobileno: ['', Validators.required],
      sv_gender: ['M'],
      sv_type: [''],
      sv_vehicleno: [''],
      sv_address: [''],
      sv_noofvisitors: [''],
      sv_purpose: [''],
      sv_entrygate: [''],
      // sv_image: [''],
      // sv_kycimages: [''],
      // sv_isactive: ['Y'],
      ms_active: ['Y'],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  onSubmit() {
    if (this.staffForm.valid) {
      this.staffForm.patchValue({
        sv_date: moment(this.staffForm.get('sv_date').value).format('DD/MM/YYYY'),
      });

      this.staffJsonArray.push(this.staffForm.value);  // to push data in Json Array

      this.dialogRef.close(this.staffForm.value);
      const data = {
        socID: this.appState.societyId,
        pmID: this.memId,
        tableData: JSON.stringify(this.staffJsonArray)  // to push data in Json Array
      };

      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newStaff(formData).subscribe(response => {
        console.log('staff response', response);

        if (response.RESPONSE === 'SUCCESS') {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.dialogRef.close();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelectedStaff(data) {
    this.isEdit = true;
    this.data.sv_date = moment(this.data.sv_date, 'DD/MM/YYYY');
    this.staffForm.patchValue(data);
  }

  closeForm(ref, deleted?) {
    this.dialogRef.close({ refresh: ref, is_delete: deleted });
  }
  radioChange(e) {
    this.staffForm.patchValue({
      sv_gender: e
    });
  }

  startDateModal() {
    this.startpicker.open();
  }

  imageUpload(event) {
    this.imageFiles = Array.from(event.target.files);
    this.imageFiles.map(e => {
      this.imgUpload.push(e);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e);
      fileReader.onload = () => {
        //  (fileReader.result);
        e.fileSrc = fileReader.result;
        return e;
      };
    });
  }

  removeImage(i) {
    this.imageFiles.splice(i, 1);
    // this.masterFormGroup.controls['ss_image'].setValue('');
  }


  onDelete(data): void {
    const deleteDialog = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });
    deleteDialog.afterClosed().subscribe(res => {
      if (res === true) {

        data = {
          socID: this.appState.societyId,
          ms_staffid: this.staffForm.get('ms_staffid').value,
          pmID: this.staffForm.get('ms_pmid').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);

        this.api.deleteStaff(formdata).subscribe((response: any) => {
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
            this.closeForm(true);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
            this.closeForm(true, true);
          }
        });
      } else {
        deleteDialog.close();
      }
    });
  }
}
