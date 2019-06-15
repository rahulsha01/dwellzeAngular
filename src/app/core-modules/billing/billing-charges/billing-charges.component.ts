import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-billing-charges',
  templateUrl: './billing-charges.component.html'
})
export class BillingChargesComponent implements OnInit {
  masterFormGroup: FormGroup;
  billingChargesConf = this.configuration.tableConf.billingChargesType;
  isForm = false;
  isEdit = false;
  dataSourceFn = this.api.allBillingCharges.bind(this.api);
  ComputedCategoryOptions = [];
  ComputedCatListener = true;
  isReadOnly: boolean;
  HeadCategoryOptions = [];
  HeadCatListener = true;
  catChangeListener = true;
  restrictInput = false;
  editData;
  filterData;
  open = true;
  billingChargesDataTransform = [{
    chr_calc: {
      C: 'Computed',
      F: 'Fixed'
    }
  },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.UtilityService,
    private api: fromShared.ApiService,
    private snackBar: fromShared.PopupsService,
    private appState: fromShared.AppState,

  ) { }

  ngOnInit() {
    this.formInit();
    this.getHeadCat('');
    this.getComputedCat('');
  }

  // code for Comp AutoComplete
  subscribeComputedData() {
    this.masterFormGroup.get('chr_comp1').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getComputedCat(e));
  }

  getComputedCat(value) {
    const data = {
      type: 'BILLING CHARGE',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.ComputedCategoryOptions = e.DATA;
    });
  }

  displayComputedTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.ComputedCatListener) {
      return this.editData.compute_on;
    } if (!this.ComputedCatListener) {
      const index = this.ComputedCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.ComputedCategoryOptions[index].lov_displayvalue;
    } else {
      const index = this.ComputedCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.ComputedCategoryOptions[index].lov_displayvalue;
    }
  }

  inpuComputedCatListener() {
    this.ComputedCatListener = false;
  }
  // End of code for Comp1 AutoComplete

  // code for Head AutoComplete
  subscribeHeadData() {
    this.masterFormGroup.get('chr_head').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getHeadCat(e));
  }

  getHeadCat(value) {
    const data = {
      type: 'BILLING HEAD',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.HeadCategoryOptions = e.DATA;
    });
  }

  displayHeadTypeFn(id) {
    if (!id) {
      console.log('a');
      return '';
    }
    if (this.isEdit && this.HeadCatListener) {
      return this.editData.BillingHead;
    } if (!this.HeadCatListener) {
      const index = this.HeadCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.HeadCategoryOptions[index].lov_displayvalue;
    } else {
      const index = this.HeadCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.HeadCategoryOptions[index].lov_displayvalue;
    }
  }

  inpuHeadCatListener() {
    this.HeadCatListener = false;
  }
  // End of code for Head AutoComplete

  formInit() {
    this.masterFormGroup = this.fb.group({
      chr_socid: [this.appState.societyId],
      chr_head: [''],
      chr_calc: ['C'],
      chr_fixedamt: [''],
      chr_comp1: [''],
      chr_comp2: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(1), Validators.max(999)]],
    });
  }

  openForm() {
    this.isForm = true;
    this.HeadCatListener = true;
    this.getHeadCat('');
    this.getComputedCat('');
  }

  closeForm() {
    this.masterFormGroup.reset();
    this.isForm = false;
    this.isEdit = false;
    this.isReadOnly = false;
    this.HeadCatListener = true;
    this.formInit();
  }

  radioChange(e) {
    if (e === 'F') {
      this.masterFormGroup.patchValue({
        chr_type: e,
        chr_comp1: '',
        chr_comp2: ''
      });
    }
    if (e === 'C') {
      this.masterFormGroup.patchValue({
        chr_type: e,
        chr_fixedamt: ''
      });
    }
  }
  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '60%',
        data: [{
          formControlName: 'chr_head',
          val: this.filterData ? this.filterData.chr_head : '',
          type: 'text',
          placeholder: 'Billing Head'
        },
        {
          formControlName: 'chr_calc',
          val: this.filterData ? this.filterData.chr_calc : '',
          type: 'text',
          placeholder: 'Billing Type'
        }
        ],
        panelClass: 'custom-modalbox',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this.filterData = result;
        this.open = true;
      });
      this.open = false;
    }
  }


  onSubmit() {
    this.masterFormGroup.get('chr_head').enable();
    if (this.masterFormGroup.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.masterFormGroup.getRawValue())
      };

      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newBillingCharges(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.isForm = false;
          this.masterFormGroup.reset();
          this.formInit();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    this.isEdit = true;
    this.masterFormGroup.controls['chr_head'].disable();
    this.isReadOnly = true;
    this.editData = data;
    console.log(data);
    data.chr_comp2 = data.chr_calc === 'F' ? '' : data.chr_comp2;
    this.masterFormGroup.patchValue(data);
    // const type_data = data.chr_calc === 'Computed' ? 'C' : 'F';
    // this.masterFormGroup.patchValue({
    //   chr_calc: type_data
    // });
    console.log(this.masterFormGroup.value);
    this.openForm();
    this.ComputedCatListener = false;
    this.HeadCatListener = false;
  }

  onHeadBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('chr_head').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        chr_head: '',
      });
    }
  }

  // onSelectionHeadChanged() use with onHeadBlur() function
  onSelectionHeadChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onDelete(data): void {
    const deletedDialog = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });
    deletedDialog.afterClosed().subscribe(res => {
      if (res === true) {
        data = {
          socID: this.appState.societyId,
          chr_socid: this.masterFormGroup.get('chr_socid').value,
          chr_head: this.masterFormGroup.get('chr_head').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteBillingCharges(formdata).subscribe((response: any) => {
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
          }
          this.formInit();
          this.isForm = false;
          this.isEdit = false;
        });
      } else {
        deletedDialog.close();
      }
    });
  } // End of onDelete
}
