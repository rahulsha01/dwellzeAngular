import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSlideToggleChange, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-society-committee',
  templateUrl: './society-committee.component.html'
})
export class SocietyCommitteeComponent implements OnInit {
  title = 'Society Committee';
  masterFormGroup: FormGroup;
  societyCommitteeConf = this.configuration.tableConf.societyCommittee;
  isForm = false;
  isEdit = false;
  dataSourceFn = this.api.allSocietyCommittee.bind(this.api);
  optionsRole = [];
  optionsPM = [];
  editDataRole;
  editDataPM;
  status = true;
  action;
  filterData;
  open = true;
  displayStartDate;
  roleInputListener = true;
  primaryMemListener = true;
  currentDate = new Date();
  options = [];
  catChangeListener = true;
  restrictInput = false;
  committeeDataTransform = [{
    comm_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];
  @ViewChild('picker1') startpicker;
  @ViewChild('picker2') endpicker;
  @ViewChild('picker3') assignedpicker;

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
  }

  subscribePrimaryMember() {
    this.masterFormGroup.get('comm_pmid').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getPrimaryMember(e));
  }

  getPrimaryMember(value) {
    const data = {
      socID: this.appState.societyId,
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allPrimaryMember(formdata).subscribe((e: any) => {
      this.optionsPM = e.DATA;
    });
  }

  displayPrimaryMemberFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.primaryMemListener) {
      return this.editDataPM.pm_firstname;
    } if (!this.primaryMemListener) {
      const index = this.optionsPM.findIndex(e => e.pm_id === id);
      return this.optionsPM[index].pm_firstname;
    } else {
      const index = this.optionsPM.findIndex(e => e.pm_id === id);
      return this.optionsPM[index].pm_firstname;
    }
  }

  primaryMemChangeFn() {
    this.primaryMemListener = false;
  }

  radioChange(e) {
    this.masterFormGroup.patchValue({
      comm_isactive: e
    });
  }

  startDateModal() {
    this.startpicker.open();
  }

  endDateModal() {
    this.endpicker.open();
  }

  assignedDateModal() {
    this.assignedpicker.open();
  }

  dateChecker(event) {
    const selectDate = moment(event).format('YYYY/MM/DD');
    const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
    this.displayStartDate = selectDate;
    if (selectDate < currentDate) {
      this.snackBar.openSnacBar('Please fill Proper Date');
      this.masterFormGroup.patchValue({
        comm_fromdate: ''
      });
    }
  }

  endDateChecker(event) {
    const selectDate = moment(event).format('YYYY/MM/DD');
    const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
    if (selectDate < this.displayStartDate) {
      this.snackBar.openSnacBar('Please fill Proper End Date');
      this.masterFormGroup.patchValue({
        comm_todate: ''
      });
    }
  }

  subscribeCommRoleLOV() {
    this.masterFormGroup.get('comm_role').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getCommRoleLOV(e));
  }

  getCommRoleLOV(value) {
    const data = {
      type: 'COMMITTEE_MEMBER',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.optionsRole = e.DATA;
    });

  }

  displayCommRoleLOVFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.roleInputListener) {
      return this.editDataRole.lov_displayvalue;
    } if (!this.roleInputListener) {
      const index = this.optionsRole.findIndex(e => e.lov_storevalue === id);
      return this.optionsRole[index].lov_displayvalue;
    } else {
      const index = this.optionsRole.findIndex(e => e.lov_storevalue === id);
      return this.optionsRole[index].lov_displayvalue;
    }
  }

  roleListener() {
    this.roleInputListener = false;
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      comm_socid: [this.appState.societyId],
      comm_id: [''],
      comm_pmid: ['', Validators.required],
      comm_role: ['', Validators.required],
      comm_assigneddate: ['', Validators.required],
      comm_fromdate: ['', Validators.required],
      comm_todate: ['', Validators.required],
      comm_isactive: ['Y'],
      created_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      update_by: ['Admin']
    });
  }

  openForm() {
    this.isForm = true;
    this.primaryMemListener = true;
    this.getPrimaryMember('');
    this.getCommRoleLOV('');
  }

  closeForm() {
    this.isForm = false;
    this.primaryMemListener = true;
    this.roleInputListener = true;
    this.masterFormGroup.reset();
    this.formInit();
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '60%',
        data: [{
          formControlName: 'pm_firstname',
          val: this.filterData ? this.filterData.pm_firstname : '',
          type: 'text',
          placeholder: 'Name'
        },
        {
          formControlName: 'comm_role',
          val: this.filterData ? this.filterData.comm_role : '',
          type: 'text',
          placeholder: 'Role',
      },
      {
        formControlName: 'comm_isactive',
        val: this.filterData ? this.filterData.comm_isactive : '',
        type: 'text',
        placeholder: 'Status',
    },
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


  onBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('comm_pmid').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        comm_pmid: '',
      });
    }
  }

  // onSelectionChanged() use with onblur() function
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onBlurRole(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('comm_role').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        comm_role: '',
      });
    }
  }

  // onRoleSelectionChanged() use with onBlurRole() function
  onRoleSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onSubmit() {
    if (this.masterFormGroup.valid) {
      const postData = this.masterFormGroup.getRawValue();
      postData.comm_assigneddate = moment(postData.comm_assigneddate).format('DD/MM/YYYY');
      postData.comm_fromdate = moment(postData.comm_fromdate).format('DD/MM/YYYY');
      postData.comm_todate = moment(postData.comm_todate).format('DD/MM/YYYY');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postData)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newSocietyCommittee(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.masterFormGroup.reset();
          this.formInit();
          this.isForm = false;
          this.isEdit = false;
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    this.isEdit = true;
    this.editDataRole = data;
    this.editDataPM = data;
    const assignDateObj = data.comm_assigneddate.split('/').reverse().join('/');
    data.comm_assigneddate = new Date(assignDateObj);
    const fromDateObj = data.comm_fromdate.split('/').reverse().join('/');
    data.comm_fromdate = new Date(fromDateObj);
    const toDateObj = data.comm_todate.split('/').reverse().join('/');
    data.comm_todate = new Date(toDateObj);
    this.masterFormGroup.patchValue(data);
    this.openForm();
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
          comm_id: this.masterFormGroup.get('comm_id').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteSocietyCommittee(formdata).subscribe(response => {
          this.isForm = false;
          this.isEdit = false;
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
          }
          this.formInit();
        });
      } else {
        deletedDialog.close();
      }
    });
  } // End of onDelete
}
