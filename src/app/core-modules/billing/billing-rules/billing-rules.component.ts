import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'dwlz-billing-rules',
  templateUrl: './billing-rules.component.html'
})
export class BillingRulesComponent implements OnInit {
  masterFormGroup: FormGroup;
  billingRulesConf = this.configuration.tableConf.billingRulesType;
  isForm = false;
  isEdit = false;
  // dataSourceFn = this.api.allBillingRules.bind(this.api);
  editData;
  currentDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.UtilityService,
    private api: fromShared.ApiService,
    private appState: fromShared.AppState,
    private snackBar: fromShared.PopupsService,
  ) { }

  ngOnInit() {
    this.formInit();
    this.getData();
  }

  getData() {
    const datas = {
      socID: this.appState.societyId,
      pageNo: 1,
      pagination: 'N',
      searchText: '',
      column: '',
      // status: this.meetingStatus ? this.meetingStatus : '',
    };

    const formdata = this.dataTransform.newFormDataArray(datas);

    this.api.allBillingRules(formdata).subscribe((e: any) => {
      console.log(e);
      this.masterFormGroup.patchValue(e.DATA[0]);
    });
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      so_societyid: this.appState.societyId,
      so_name: [''],
      so_type: [''],
      so_registrationid: [''],
      so_registration_dt: [''],
      so_nbrofunits: [''],
      so_noofparkings: [''],
      so_primcode: [''],
      so_seccode: [''],
      so_address: [''],
      so_pincode: [''],
      so_isactive: [''],
      so_bankname: [''],
      so_branch: [''],
      so_bankacno: [''],
      created_dt: [moment(this.currentDate).format('YYYY/MM/DD')],
      update_dt: [moment(this.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_by: ['Admin'],
      so_billingfreq: ['M'],
      so_intmethod: ['S'],
      so_intperc: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(1), Validators.max(999)]],
      so_duedays: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(1), Validators.max(999)]],
    });
  }

  openForm() {
    this.isForm = true;
  }

  closeForm() {
    this.masterFormGroup.reset();
    this.isForm = false;
    this.isEdit = false;
    this.formInit();
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(fromShared.FilterDialogComponent, {
      width: '50%',
      height: '50%',
      data: this.billingRulesConf.columns
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onSubmit() {
    if (this.masterFormGroup.valid) {
      // alert('Detalis Are Valid');
      const data = {
        socID: this.appState.societyId,
        societyData: JSON.stringify(this.masterFormGroup.value)
      };

      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newBillingRules(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');

          // this.masterFormGroup.reset();
          this.getData();
          // this.isForm = false;
          // this.formInit();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    this.isEdit = true;
    this.editData = data;
    this.masterFormGroup.patchValue(data);
    this.openForm();
  }

  radioChangeInt(e) {
    this.masterFormGroup.controls['so_intmethod'].setValue(e);
  }

  radioChangeFreq(e) {
    this.masterFormGroup.controls['so_billingfreq'].setValue(e);
  }

  // onDelete(data): void {
  //   this.dialog.open(MatConfirmDialogComponent, {
  //     width: '390px',
  //     panelClass: 'confirm-dialog-container',
  //     disableClose: true,       data: {         Heading: 'Confirm',         Message: 'Are you Sure you want to Continue'       }
  //     data: {
  //       Heading: 'Confirm',
  //       Message: 'Are you Sure you want to Continue'
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res === true) {
  //       data = {
  //         socID: this.appState.societyId,
  //         chr_socid: this.masterFormGroup.get('chr_socid').value,
  //         chr_head: this.masterFormGroup.get('chr_head').value
  //       };
  //     }
  //     const formdata = this.dataTransform.newFormDataArray(data);
  //     this.api.deleteBillingRules(formdata).subscribe(response => {
  //       this.isForm = false;
  //       this.snackBar.openSnacBar('Data Deleted Successfully');
  //       this.formInit();
  //     });
  //   });
  //  } // End of onDelete
}
