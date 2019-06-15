import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatSlideToggleChange, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-meeting-schedule',
  templateUrl: './meeting-schedule.component.html'
})
export class MeetingScheduleComponent implements OnInit {
  title = 'Meetings';
  masterFormGroup: FormGroup;
  SubServiceForm: FormGroup;

  mtgScheduleConf = this.configuration.tableConf.meetingSchedule;
  isEdit = false;
  dataSourceFn = this.api.allMtgSchedule.bind(this.api);
  completedDataSourceFn = this.api.allMtgSchedule.bind(this.api);
  initiateByOptions = [];
  statusOptions = [];
  editDataForStatus;
  Completed = true;
  editDataForIntit;
  status = true;
  statusChangeListener = true;
  initiateByChangeListener = true;
  action = 'Active';
  lovType: string;
  @ViewChild('picker') meetingDatepicker;
  displayStartDate;
  currentDate = new Date();
  statusTab = [];
  completedText: any = 'Completed';
  allData: any = '';
  tabgroup = true;
  catChangeListener = true;
  restrictInput = false;
  isScheduledForm = false;
  isCompletedForm = false;
  // isScheduledTable = true;
  // isCompletedTable = false;
  metaDataAll: { 'status': any; };
  metaDataComp: { 'status': any; };
  hideTab = document.getElementsByClassName('mat-tab-header') as HTMLCollectionOf<HTMLElement>;
  checkStatus: String;
  imageFiles = [];
  imgUpload = [];
  readOnly: boolean;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.UtilityService,
    private api: fromShared.ApiService,
    private snackBar: fromShared.PopupsService,
    private dataTransfer: fromShared.DataTransferService,
    private formBuilder: FormBuilder,
    private appState: fromShared.AppState,

  ) { }

  ngOnInit() {
    this.formInit();
    this.sendStatus();
    this.lovsTypeStatus();
    this.lovsInitiateBy();
    this.getLovStatus();
  }

  sendStatus() {
    const formData = { 'status': this.allData };
    this.metaDataAll = formData;
    const frmData = { 'status': this.completedText };
    this.metaDataComp = frmData;
  }
  lovsInitiateBy() {
    this.lovType = 'A';
    this.masterFormGroup.get('mtgs_initby').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getLovTypeForInit(e));
  }


  lovsTypeStatus() {
    console.log('aa');
    this.masterFormGroup.get('mtgs_status').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getLovTypeForStatus(e));
  }

  getLovTypeForStatus(value) {
    const data = {
      type: 'MTG_STATUS',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.statusOptions = e.DATA;
    });
  }

  getLovStatus() {
    const data = {
      type: 'MTG_STATUS',
      pageNo: 0,
      pagination: 'N',
      status: '',
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.statusTab = e.DATA;
    });
  }

  switchTab(event) {
    // this.isScheduledTable = false;
    // this.isCompletedTable = false;


    if (event.index === 0) {
      this.isScheduledForm = false;
    }
    if (event.index === 1) {
      this.isCompletedForm = false;
    }


  }
  getLovTypeForInit(value) {
    const data = {
      type: 'COMMITTEE_MEMBER',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.initiateByOptions = e.DATA;
    });
  }

  displayLovTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.statusChangeListener) {
      console.log(this.editDataForStatus.status);
      // tslint:disable-next-line:no-unused-expression
      return this.editDataForStatus.status;
    } if (!this.statusChangeListener) {
      const index = this.statusOptions.findIndex(e => e.lov_storevalue === id);
      this.checkStatus = this.statusOptions[index].lov_displayvalue;
      // console.log(this.checkStatus);
      return this.checkStatus;
    } else {
      const index = this.statusOptions.findIndex(e => e.lov_storevalue === id);
      this.checkStatus = this.statusOptions[index].lov_displayvalue;
      // console.log(this.checkStatus);
      return this.checkStatus;
    }
    // console.log('a');
    console.log(this.checkStatus);
    // this.readOnly = this.checkStatus === 'Completed' ? true : false
    // console.log(this.readOnly)
  }

  statusValueChangeFn() {
    this.statusChangeListener = false;
  }
  initiateByValueChangeFn() {
    this.initiateByChangeListener = false;
  }
  // editDataIntit
  displayLovTypeInitFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.initiateByChangeListener) {
      return this.editDataForIntit.init_by;
    } if (!this.initiateByChangeListener) {
      const index = this.initiateByOptions.findIndex(e => e.lov_storevalue === id);
      return this.initiateByOptions[index].lov_displayvalue;
    } else {
      const index = this.initiateByOptions.findIndex(e => e.lov_storevalue === id);
      return this.initiateByOptions[index].lov_displayvalue;
    }
  }

  onBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('mtgs_initby').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        mtgs_initby: '',
      });
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onBlurStatus(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('mtgs_status').value;
    console.log('adc');
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        mtgs_status: '',
      });
    }
  }

  onSelectionChangedStatus(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }
  formInit() {
    this.masterFormGroup = this.fb.group({
      mtgs_socid: [this.appState.societyId, Validators.required],
      mtgs_id: [''],
      mtgs_title: ['', Validators.required],
      mtgs_agenda: ['', Validators.required],
      mtgs_venue: ['', Validators.required],
      mtgs_date: ['', Validators.required],
      mtgs_starttime: ['', Validators.required],
      mtgs_endtime: ['', Validators.required],
      mtgs_attendees: [],
      mtgs_onlycomm: [],
      mtgs_initby: ['', [Validators.required]],
      mtgs_status: ['', Validators.required],
      created_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      update_by: ['Admin'],
    });
  }

  openScheduledForm() {
    this.openForm();
    this.isScheduledForm = true;
    // this.isCompletedForm = false;
  }

  openCompletedForm() {
    this.openForm();
    this.isCompletedForm = true;
    // this.isScheduledForm = false;

  }

  openForm() {
    this.hideTab[0].style.display = 'none';
  }

  closeForm() {
    this.isEdit = false;
    this.isScheduledForm = false;
    this.isCompletedForm = false;
    this.statusChangeListener = true;
    this.initiateByChangeListener = true;
    this.hideTab[0].style.display = 'flex';
    this.masterFormGroup.reset();
    this.formInit();
    this.checkStatus = '';
    // this.Completed = true;
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(fromShared.FilterDialogComponent, {
      width: '300px',
      height: '200px',
      data: {
        dataKey: this.mtgScheduleConf.columns
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onSubmit() {
    if (this.masterFormGroup.valid) {
      const postData = this.masterFormGroup.getRawValue();
      postData.mtgs_date = moment(postData.mtgs_date).format('DD/MM/YYYY');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postData)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formdata.append('imageFile', e);
      });
      this.api.newMtgSchedule(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.isScheduledForm = false;
          this.isCompletedForm = false;
          this.hideTab[0].style.display = 'flex';
          this.snackBar.openSnacBar('Data Saved Successfully');
          this.statusChangeListener = true;
          this.initiateByChangeListener = true;
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
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
  }


  emitCompletedSelected(data) {

    this.isEdit = true;
    this.editDataForStatus = data;
    this.editDataForIntit = data;
    const dateObj = data.mtgs_date.split('/').reverse().join('/');
    data.mtgs_date = new Date(dateObj);
    this.masterFormGroup.patchValue({ mtgs_status: data.init_by });
    this.masterFormGroup.patchValue(data);
    this.openCompletedForm();
  }

  emitScheduledSelected(data) {
   console.log(data);
    this.hideTab[0].style.display = 'none';
    this.isEdit = true;
    this.editDataForStatus = data;

    // this.statusChangeListener = false;
    this.editDataForIntit = data;
    data.mtgs_attendees = data.mtgs_status !== 'Completed' ? '' : data.mtgs_attendees;
    const dateObj = data.mtgs_date.split('/').reverse().join('/');
    data.mtgs_date = new Date(dateObj);
    this.masterFormGroup.patchValue({ mtgs_status: data.init_by });
    this.masterFormGroup.patchValue(data);
    // console.log(this.masterFormGroup.value);
    this.openScheduledForm();
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
            mtg_id: this.masterFormGroup.get('mtg_id').value
          };
          const formdata = this.dataTransform.newFormDataArray(data);
          this.api.deleteMtgSchedule(formdata).subscribe((response: any) => {
            this.isScheduledForm = false;
            this.isCompletedForm = false;
            this.hideTab[0].style.display = 'flex';
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

  meetingDateModal() {
    this.meetingDatepicker.open();
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

  //
  // get subscriptionDetailsList(): FormArray {
  //   return this.SubServiceForm.get('subscriptionDetails') as FormArray;
  // }

  // addsubscriptionDetailsList() {
  //   this.subscriptionDetailsList.push(this.formBuilder.group({
  //     sbs_srvid: [''],
  //     sbs_id: [''],
  //     sbs_title: ['', Validators.required],
  //     sbs_description: ['', Validators.required],
  //     lsImgPresent: ['N']
  //   }));
  // } // End of addsubscriptionDetailsList

  // removeInputField(i: number) {
  //   this.subscriptionDetailsList.removeAt(i);
  // }

  // addNewInputField() {
  //   this.addsubscriptionDetailsList();
  // }
}
