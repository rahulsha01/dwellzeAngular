import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import * as moment from 'moment';
import { isArray } from 'util';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-society-staff',
  templateUrl: './society-staff.component.html'
})
export class SocietyStaffComponent implements OnInit {
  title = 'Society Staff';
  masterFormGroup: FormGroup;
  societyStaffConf = this.configuration.tableConf.societyStaff;
  isForm = false;
  isEdit = false;
  patchDays: any;
  filterData;
  open = true;
  week = [{ 'day': 'Sun', 'isSelected': false },
  { 'day': 'Mon', 'isSelected': false },
  { 'day': 'Tue', 'isSelected': false },
  { 'day': 'Wed', 'isSelected': false },
  { 'day': 'Thu', 'isSelected': false },
  { 'day': 'Fri', 'isSelected': false },
  { 'day': 'Sat', 'isSelected': false }];
  workingDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dataSourceFn = this.api.allSocietyStaff.bind(this.api);
  staffCategoryOptions = [];
  staffCatListener = true;
  editData;
  days: any;
  selectedAll = false;
  daysArr: any;
  createForm = false;
  imgUpload = [];
  imageFiles = [];
  startHour;
  endHour;
  startMin;
  endMin;
  imgSrc;
  docsFiles = [];
  documentUpload = [];

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
    this.getStaffCat('');
    this.subscribeStaffCat();
    this.daysData();
    this.shiftStartTime();
    this.shiftEndTime();
  }

  shiftStartTime() {
    this.masterFormGroup.get('ss_starttime').valueChanges.subscribe(e => this.startHourVal(e));
  }

  startHourVal(e) {
  }

  shiftEndTime() {
    this.masterFormGroup.get('ss_endtime').valueChanges.subscribe(e => this.endHourVal(e));
  }

  endHourVal(e) {
  }

  daysData() {
    const data = {
      type: 'DAY',
      pageNo: 0,
      pagination: 'N',
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.days = e.DATA;
    });
  }
  subscribeStaffCat() {
    this.masterFormGroup.get('ss_staffcat').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getStaffCat(e));
  }

  getStaffCat(value) {
    const data = {
      type: 'STAFF_CAT',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.staffCategoryOptions = e.DATA;
    });
  }

  displayUnitTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.staffCatListener) {
      return this.editData.lov_displayvalue;
    } if (!this.staffCatListener) {
      const index = this.staffCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.staffCategoryOptions[index].lov_displayvalue;
    } else {
      const index = this.staffCategoryOptions.findIndex(e => e.lov_storevalue === id);
      return this.staffCategoryOptions[index].lov_displayvalue;
    }
  }

  inpuStaffCatListener() {
    this.staffCatListener = false;
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      ss_socid: [this.appState.societyId],
      ss_id: [''],
      ss_pmid: [''],
      ss_socstaff: ['Y'],
      ss_empid: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      ss_name: ['', Validators.required],
      ss_address: ['', Validators.required],
      ss_mobile: ['', Validators.required],
      ss_staffcat: ['', Validators.required], // AutoComplete
      ss_starttime: ['', Validators.required],
      ss_endtime: ['', Validators.required],
      ss_weeklyoff: [''],
      ss_holidays: [[]],
      ss_image: [''],
      created_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      update_by: ['Admin']
    });
  }

  openForm() {
    this.createForm = true;
    this.isForm = true;
    this.getStaffCat('');
  }

  closeForm() {
    this.isForm = false;
    this.isEdit = false;
    this.createForm = false;
    this.masterFormGroup.reset();
    this.formInit();
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '60%',
        data: [{
          formControlName: 'ss_name',
          val: this.filterData ? this.filterData.ss_name : '',
          type: 'text',
          placeholder: 'Name'
        },
        {
          formControlName: 'ss_staffcat',
          val: this.filterData ? this.filterData.ss_staffcat : '',
          type: 'text',
          placeholder: 'Category',
        },
        {
          formControlName: 'ss_address',
          val: this.filterData ? this.filterData.ss_address : '',
          type: 'text',
          placeholder: 'Address',
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
  checkForTime() {

    // tslint:disable-next-line:radix
    if (parseInt(this.startHour) > parseInt(this.endHour)) {
      this.masterFormGroup.patchValue({
        ss_endtime: ''
      });
      this.snackBar.openSnacBar('End Time Must Be Greater Than Start Time');
    }
    if (this.startHour === this.endHour && this.endMin < this.startMin) {
      this.masterFormGroup.patchValue({
        ss_endtime: ''
      });
      this.snackBar.openSnacBar('End Time Must Be Greater Than Start Time');
    }
  }


  // onChange(event, i) {
  //   const feat = event.source.value;
  //   // Pooja
  //   event.checked = this.isSelected(feat);
  //   if (event.checked) {
  //     this.masterFormGroup.controls.ss_holidays.value.push(feat);
  //   } else {
  //      (event.source.value);
  //     const index = this.masterFormGroup.controls.ss_holidays.value.findIndex(x => x === feat);
  //      (index);
  //     this.masterFormGroup.controls.ss_holidays.value.splice(index, 1);
  //   }
  // }

  onChange(event, i) {
    const feat = event.source.value;
    if (event.checked) {
      this.masterFormGroup.controls.ss_holidays.value.push(feat);
    } else {
      const index = this.masterFormGroup.controls.ss_holidays.value.findIndex(x => x === feat);
      this.masterFormGroup.controls.ss_holidays.value.splice(index, 1);
    }
  }

  // Pooja
  selectAll(e) {
    this.selectedAll = e.source._checked;
    if (this.selectedAll) {
      this.week.forEach(day => {
        day.isSelected = true;
        this.masterFormGroup.controls.ss_holidays.value.push(day.day);
      });
    } else { // reset all options
      this.week.forEach(day => {
        day.isSelected = false;
        const index = this.masterFormGroup.controls.ss_holidays.value.findIndex(x => x === day.day);
        this.masterFormGroup.controls.ss_holidays.value.splice(index, 1);
      });
    }
  }

  // isSelected(value): boolean {
  //   const weekday = this.week.filter(item => item.day === value);
  //   if (this.isEdit) {
  //     const checkboxValue = this.masterFormGroup.get('ss_weeklyoff').value.split(',').map(String).filter(item =>
  //       item === value);
  //      (checkboxValue);
  //     if (checkboxValue.length > 0) {
  //       weekday[0].isSelected = true;
  //       return true;
  //     } else {
  //       weekday[0].isSelected = false;
  //       return false;
  //     }
  //   } else {
  //     if (weekday[0].isSelected) {
  //       weekday[0].isSelected = false;
  //       return false;
  //     } else {
  //       weekday[0].isSelected = true;
  //       return true;
  //     }
  //   }
  // }

  isSelected(value: string): boolean {
    const checkboxValue = (this.masterFormGroup.get('ss_weeklyoff').value).split(',').map(String).filter(item =>
      item === value);
    if (checkboxValue.length > 0) {
      return true;
    } else {
      return false;
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
    this.masterFormGroup.controls['ss_image'].setValue('');
  }

  docsUpload(event) {
    this.docsFiles = Array.from(event.target.files);
    this.docsFiles.map(e => {
      this.documentUpload.push(e);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e);
      fileReader.onload = () => {
        //  (fileReader.result);
        e.fileSrc = fileReader.result;
        return e;
      };
    });
  }

  removeDocument(i) {
    this.docsFiles.splice(i, 1);
    // this.masterFormGroup.controls['ss_image'].setValue('');
  }

  onSubmit() {
    if (this.masterFormGroup.valid) {
      const arrDays: any = this.masterFormGroup.get('ss_holidays').value;
      this.masterFormGroup.patchValue({ ss_weeklyoff: arrDays.toString() });
      this.masterFormGroup.removeControl('ss_holidays');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.masterFormGroup.value)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newSocietyStaff(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.isForm = false;
          this.masterFormGroup.reset();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  // emitSelected(data) {
  //   this.isEdit = true;
  //   this.createForm = false;
  //    ('Data' + data);
  //   this.editData = data;
  //   const weeklyoffData = data.ss_weeklyoff;
  //   this.daysArr = weeklyoffData.split(',');
  //   this.masterFormGroup.addControl('ss_holidays', new FormControl(''));
  //   this.masterFormGroup.patchValue({
  //     ss_holidays: weeklyoffData.split(',')
  //   });
  //   this.patchDays = this.masterFormGroup.value;
  //    ('Patch' + this.patchDays);
  //   this.masterFormGroup.patchValue(data);
  //   this.openForm();
  // }

  // emitSelected(data) {
  //   this.isEdit = true;
  //   this.createForm = false;
  //    ('Data' + data);
  //   this.editData = data;
  //   const weeklyoffData = data.ss_weeklyoff;
  //   this.daysArr = weeklyoffData.split(',');
  //   this.masterFormGroup.addControl('ss_holidays', new FormControl(''));
  //   this.masterFormGroup.patchValue({
  //     ss_holidays: weeklyoffData.split(',')
  //   });
  //   this.patchDays = this.masterFormGroup.value;
  //    ('Patch' + this.patchDays);
  //   this.masterFormGroup.patchValue(data);
  //   this.openForm();
  // }


  emitSelected(data) {
    this.isEdit = true;
    this.createForm = false;
    this.editData = data;
    const weeklyoffData = data.ss_weeklyoff;
    this.daysArr = weeklyoffData.split(',');
    this.masterFormGroup.addControl('ss_holidays', new FormControl(''));
    this.masterFormGroup.patchValue({
      ss_holidays: weeklyoffData.split(',')
    });
    this.patchDays = this.masterFormGroup.value;
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
          ss_id: this.masterFormGroup.get('ss_id').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteSocietyStaff(formdata).subscribe((response: any) => {
          // this.isForm = false;
          // this.createForm = false;
          // this.masterFormGroup.reset();
          // this.snackBar.openSnacBar('Data Deleted Successfully');
          // this.formInit();
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
          }
          this.isForm = false;
          this.isEdit = false;
          this.formInit();
        });
      } else {
        deletedDialog.close();
      }
    });
  } // End of onDelete

}
