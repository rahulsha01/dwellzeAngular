import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
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
  selector: 'dwlz-notice-board',
  templateUrl: './notice-board.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NoticeBoardComponent implements OnInit {
  masterFormGroup: FormGroup;
  noticeBoardConf = this.configuration.tableConf.noticeBoard;
  currentDate = new Date();
  isForm = false;
  isEdit = false;
  imageFiles = [];
  imgUpload = [];
  optionsPM = [];
  wingData = [];
  displayStartDate;
  filterData;
  open = true;
  primaryMemListener = true;
  catChangeListener = true;
  restrictInput = false;
  draftedby = new FormControl();
  isOpenForm = false;
  isExpiredForm = false;
  tabgroup = true;
  metaDataAll: { 'status': any; };
  metaDataExpired: { 'status': any; };
  hideTab = document.getElementsByClassName('mat-tab-header') as HTMLCollectionOf<HTMLElement>;
  editDataPM;
  dataSourceFn = this.api.allNoticeBoard.bind(this.api);
  @ViewChild('picker') startpicker;
  @ViewChild('picker1') endpicker;

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
    this.sendStatus();
  }

  sendStatus() {
    const formData = { 'status': 'O' };
    this.metaDataAll = formData;
    const frmData = { 'status': 'X' };
    this.metaDataExpired = frmData;
  }

  switchTab(event) {
    // this.isOpenTable = false;
    // this.isExpiredTable = false;


    if (event.index === 0) {
      this.isOpenForm = false;
    }
    if (event.index === 1) {
      this.isExpiredForm = false;
    }


  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      nb_socid: [this.appState.societyId, Validators.required],
      nb_id: [''],
      nb_title: ['', [Validators.required]],
      nb_desc: ['', [Validators.required]],
      nb_draftedby: ['', Validators.required],
      nb_approvedby: ['', Validators.required],
      nb_refno: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]{8,15}$/)]],
      nb_validtill: ['', Validators.required],
      nb_publishdate: ['', Validators.required],
    });
  }

  openOpenForm() {
    this.openForm();
    this.isOpenForm = true;
    // this.isExpiredForm = false;
  }

  openExpiredForm() {
    this.openForm();
    this.isExpiredForm = true;
    // this.isOpenForm = false;

  }

  openForm() {
    this.hideTab[0].style.display = 'none';
    this.isForm = true;
    this.primaryMemListener = true;
    this.getPrimaryMember('');
  }

  closeForm() {
    this.hideTab[0].style.display = 'flex';
    this.masterFormGroup.reset();
    this.isOpenForm = false;
    this.isExpiredForm = false;
    this.isForm = false;
    this.isEdit = false;
    this.primaryMemListener = true;
    this.formInit();
  }

  startDateModal() {
    this.startpicker.open();
  }

  endDateModal() {
    this.endpicker.open();
  }

  dateChecker(event) {
    const selectDate = moment(event).format('YYYY/MM/DD');
    const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
    this.displayStartDate = selectDate;
    if (selectDate < currentDate) {
      this.snackBar.openSnacBar('Please Select Valid Date');
      this.masterFormGroup.patchValue({
        nb_publishdate: ''
      });
    }
  }

  endDateChecker(event) {
    const selectDate = moment(event).format('YYYY/MM/DD');
    const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
    if (selectDate < this.displayStartDate) {
      this.masterFormGroup.patchValue({
        nb_validtill: ''
      });
      this.snackBar.openSnacBar('Please Select Valid End Date');
    }
  }

  Checker(event) {
    const Approved = this.masterFormGroup.controls['nb_approvedby'].value;
    const Drafted = this.masterFormGroup.controls['nb_draftedby'].value;
    if (Approved === Drafted) {
      this.snackBar.openSnacBar('Please Select Valid Approval');
      this.masterFormGroup.patchValue({
        nb_approvedby: ''
      });
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
    // this.masterFormGroup.controls['amty_image'].setValue('');
  }

  subscribePrimaryMember() {
    this.masterFormGroup.get('nb_draftedby').valueChanges.pipe(
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
    this.api.allSocietyCommittee(formdata).subscribe((e: any) => {
      this.optionsPM = e.DATA;
    });
  }

  // displayPrimaryMemberFn(id) {
  //   if (!id) {
  //     return '';
  //   }
  //   if (this.isEdit && this.primaryMemListener) {
  //     return this.editDataPM.pm_firstname;
  //   } if (!this.primaryMemListener) {
  //     const index = this.optionsPM.findIndex(e => e.pm_id === id);
  //     return this.optionsPM[index].pm_firstname;
  //   } else {
  //     const index = this.optionsPM.findIndex(e => e.pm_id === id);
  //     return this.optionsPM[index].pm_firstname;
  //   }
  // }

  // primaryMemChangeFn() {
  //   this.primaryMemListener = false;
  // }

  // //
  // onBlur(event) {
  //   this.catChangeListener = false;
  //   const inputVal = this.masterFormGroup.get('nb_draftedby').value;
  //   if (this.restrictInput === false || inputVal.length !== 36) {
  //     this.masterFormGroup.patchValue({
  //       nb_draftedby: '',
  //     });
  //   }
  // }

  // // onSelectionChanged() use with onblur() function
  // onSelectionChanged(event: MatAutocompleteSelectedEvent) {
  //   this.restrictInput = true;
  // }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '40%',
        height: '30%',
        data: [{
          formControlName: 'nb_title',
          val: this.filterData ? this.filterData.nb_title : '',
          type: 'text',
          placeholder: 'Title'
        },
        ],
        panelClass: 'custom-modalbox',
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log(result);
        this.filterData = result;
        this.open = true;
      });
      this.open = false;
    }
  }

  onSubmit() {
    if (this.masterFormGroup.valid) {
      const postData = this.masterFormGroup.getRawValue();
      postData.nb_publishdate = moment(postData.nb_publishdate).format('DD/MM/YYYY');
      postData.nb_validtill = moment(postData.nb_validtill).format('DD/MM/YYYY');

      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postData)
      };

      const formData = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formData.append('imageFile', e);
      });

      this.api.newNoticeBoard(formData).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.isOpenForm = false;
          this.isExpiredForm = false;
          this.hideTab[0].style.display = 'flex';
          this.snackBar.openSnacBar('Data Added / Updated Successfully');
          this.isForm = false;
          this.masterFormGroup.reset();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitOpenSelected(data) {
    this.isEdit = true;
    this.editDataPM = data.pm_firstname;
    data.nb_publishdate = moment(data.nb_publishdate, 'DD/MM/YYYY');
    data.nb_validtill = moment(data.nb_validtill, 'DD/MM/YYYY');
    data.doc_filepath ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + data.doc_filepath } : this.imageFiles = [];
    this.masterFormGroup.patchValue(data);
    // this.openForm();
    this.openOpenForm();
  }


  emitExpiredSelected(data) {
    this.isEdit = true;
    this.editDataPM = data.pm_firstname;
    data.nb_publishdate = moment(data.nb_publishdate, 'DD/MM/YYYY');
    data.nb_validtill = moment(data.nb_validtill, 'DD/MM/YYYY');
    data.doc_filepath ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + data.doc_filepath } : this.imageFiles = [];
    this.masterFormGroup.patchValue(data);
    this.openExpiredForm();
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
          nb_id: this.masterFormGroup.get('nb_id').value
        };
      }
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.deleteNoticeBoard(formdata).subscribe(response => {
        this.isForm = false;
        this.isOpenForm = false;
        this.isExpiredForm = false;
        this.hideTab[0].style.display = 'flex';
        if (response.RESPONSE === fromShared.failure) {
          this.snackBar.openSnacBar(response.MESSAGE);
        } else {
          this.snackBar.openSnacBar('Data Deleted Successfully');
          this.formInit();
        }
      });
    });
  } // End of onDelete
}
