import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from './../../../../shared';
import * as _moment from 'moment';
const moment = _moment;
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

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
  selector: 'dwlz-assets',
  templateUrl: './assets.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AssetsComponent implements OnInit {

  assetsForm: FormGroup;
  isEdit: boolean;
  purchaseDate = true;
  currentDate = moment();
  maxPurchaseDate;
  minMaintenanceDate;
  @ViewChild('picker1') startpicker;
  @ViewChild('picker2') endpicker;
  editData: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssetsComponent>,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dialog: MatDialog,
    private appState: fromShared.AppState,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.openForm();
    // this.assetsForm.controls['sas_purdate'].valueChanges.subscribe(e => {
    //   console.log(e);
    //   if (!e) {
    //     this.assetsForm.controls['sas_amcdate'].disable();
    //   } else {
    //     this.assetsForm.controls['sas_amcdate'].setValue('');
    //     this.assetsForm.controls['sas_amcdate'].enable();
    //   }
    // });
  }

  purchaseDateChanged(e) {
    if (e.value) {
      this.purchaseDate = false;
      this.minMaintenanceDate = moment(e.value).add(1, 'd');
      this.maxPurchaseDate = moment(e.value);
      this.assetsForm.patchValue({
        sas_purdate: moment(e.value),
        sas_amcdate: this.minMaintenanceDate
      });

    } else {
      this.minMaintenanceDate = '';
      this.purchaseDate = true;
    }

  }

  // cancelPurchaseDate(e) {
  //   this.minMaintenanceDate = '';
  //   this.maxPurchaseDate = '';
  //   this.assetsForm.patchValue({
  //     sas_purdate: '',
  //     sas_amcdate: ''
  //   });
  //   this.purchaseDate = true;
  // }

  // stopManualInput($event) {
  //   if ($event.code !== 'Tab') {
  //     $event.preventDefault();
  //   }
  // }
  maintenanceDateChanged(e) {
    if (e.value) {
      this.assetsForm.patchValue({ sas_amcdate: moment(e.value) });
    }

  }

  openForm() {
    this.formInit();
    if (this.data) {
      this.emitSelectedAssets();
    }
    // this.purchaseDate = false;
  }

  private emitSelectedAssets() {
    this.purchaseDate = this.data.sas_amcdate ? false : true;
    this.data.sas_amcdate = moment(this.data.sas_amcdate, 'DD/MM/YYYY');
    this.data.sas_purdate = moment(this.data.sas_purdate, 'DD/MM/YYYY');
    // this.minMaintenanceDate = moment(this.data.sas_amcdate, 'DD/MM/YYYY').toISOString();
    // this.maxPurchaseDate = moment(this.data.sas_purdate, 'DD/MM/YYYY').toISOString();
    this.assetsForm.patchValue(this.data);
    this.isEdit = true;
  }

  formInit() {
    this.assetsForm = this.fb.group({
      sas_socid: [this.appState.societyId],
      sas_id: [''],
      sas_name: ['', Validators.required],
      sas_purdate: ['', Validators.required],
      sas_amcdate: ['', Validators.required],
      sas_value: ['', Validators.required],
      sas_mc_frequency: ['', Validators.required],
      sas_supplier: ['', Validators.required],
      sas_amcamt: ['', Validators.required],
      sas_isactive: ['Y', Validators.required],
      created_dt: [moment().format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment().format('YYYY/MM/DD')],
      update_by: ['admin']
    });
  }

  onSubmit() {
    if (this.assetsForm.valid) {
      this.assetsForm.value.sas_purdate = this.assetsForm.value.sas_purdate.format('DD/MM/YYYY');
      this.assetsForm.value.sas_amcdate = this.assetsForm.value.sas_amcdate.format('DD/MM/YYYY');

      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.assetsForm.value)
      };
      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newAssets(formData).subscribe(response => {
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
          sas_id: this.assetsForm.get('sas_id').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteAssets(formdata).subscribe(response => {
          this.snackBar.openSnacBar('Data Deleted Successfully');
          this.closeForm(true, true);
        });
      }
    });
  } // End of onDelete

  startDateModal() {
    this.startpicker.open();
  }

  endDateModal() {
    this.endpicker.open();
  }

  // dateChecker(event) {
  //   const selectDate = moment(event).format('YYYY/MM/DD');
  //   const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
  //   // this.displayStartDate = selectDate;
  //   if (selectDate > currentDate) {
  //     this.snackBar.openSnacBar('Please Select Valid Date');
  //     this.assetsForm.patchValue({
  //       sas_purdate: ''
  //     });
  //   }
  // }

  // endDateChecker(event) {
  //     const selectDate = moment(event).format('YYYY/MM/DD');
  //     const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
  //     // if (selectDate < this.displayStartDate) {
  //     //   this.snackBar.openSnacBar('Please Select Valid Date');
  //     //   this.assetsForm.patchValue({
  //     //     sas_amcdate: ''
  //     //   });
  //     // }
  // }

}
