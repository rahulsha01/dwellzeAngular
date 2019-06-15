import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-response',
  templateUrl: './response.component.html'
})
export class ResponseComponent implements OnInit {
  masterFormGroup: FormGroup;
  complainConf = this.configuration.tableConf.complain;
  isForm = false;
  isEdit = false;
  editData;
  options = [];
  dataSourceFn = this.api.allComplain.bind(this.api);
  filterData;
  open = true;
  optionsRole = [];
  optionsPM = [];
  editDataRole;
  editDataPM;
  status = true;
  action;
  initiateByChangeListener = true;
  editDataForStatus;
  editDataForIntit;
  initiateByOptions = [];
  comp_status: boolean;
  societyForm: FormGroup;
  responseDataTransform = [{
    comp_isurgent: {
      Y: 'Yes',
      N: 'No'
    }
  },
  {
    comp_status: {
      O: 'Open',
      C: 'Closed'
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
    this.comp_status = true;
    this.formInit();
    this.subscribeUnitType();
  }

  subscribeUnitType() {
    this.masterFormGroup.get('comp_cat').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getComp_Type(e));
  }

  initiateByValueChangeFn() {
    this.initiateByChangeListener = false;
  }

  displayUnitTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.initiateByChangeListener) {
      return this.editData.lov_displayvalue;
    } if (!this.initiateByChangeListener) {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    } else {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    }
  }

  getComp_Type(value) {
    // const Comp_Type = {
    const data = {
      socID: this.appState.societyId,
      type: 'COMP_TYPE',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };

    const formdata = this.dataTransform.newFormDataArray(data);
    // }
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.options = e.DATA;
    });

  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      comp_id: [''],
      comp_socid: [this.appState.societyId],
      comp_pmid: [''],
      comp_cat: [''],
      comp_title: [''],
      comp_desc: [''],
      comp_relatedto: [''],
      comp_isurgent: [''],
      comp_status: [''],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
    this.societyForm = this.fb.group({
      comp_response: []
    });
  }

  openForm() {
    this.isForm = true;
  }

  closeForm() {
    this.isForm = false;
    this.initiateByChangeListener = true;
    this.masterFormGroup.reset();
    this.formInit();
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '55%',
        data: [{
          formControlName: 'comp_title',
          val: this.filterData ? this.filterData.comp_title : '',
          type: 'text',
          placeholder: 'Title'
        },
        {
          formControlName: 'comp_cat',
          val: this.filterData ? this.filterData.comp_cat : '',
          type: 'text',
          placeholder: 'Category'
        },
        {
          formControlName: 'comp_isurgent',
          val: this.filterData ? this.filterData.comp_isurgent : '',
          type: 'text',
          placeholder: 'Urgent'
        },
        {
          formControlName: 'comp_status',
          val: this.filterData ? this.filterData.comp_status : '',
          type: 'text',
          placeholder: 'Status'
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
    if (this.masterFormGroup.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.masterFormGroup.value)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newComplain(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.isForm = false;
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    this.isEdit = true;
    this.editData = data;
    this.editDataForStatus = data;
    this.editDataForIntit = data;
    this.masterFormGroup.patchValue(data);
    this.openForm();
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
          comp_id: this.masterFormGroup.get('comp_id').value
        };
      }
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.deleteComplain(formdata).subscribe(response => {
        this.isForm = false;
        this.snackBar.openSnacBar('Data Deleted Successfully');
        this.formInit();
      });
    });
  } // End of onDelete

}
