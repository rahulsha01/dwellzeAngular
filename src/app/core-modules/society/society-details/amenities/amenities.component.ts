import { Component, OnInit, Inject, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as fromShared from '../../../../shared';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { DataTableComponent } from '../../../../shared';
@Component({
  selector: 'dwlz-amenities',
  templateUrl: './amenities.component.html',
})
export class AmenitiesComponent implements OnInit {

  @ViewChild(DataTableComponent) datatable: DataTableComponent;
  amenityForm: FormGroup;
  status: boolean;
  action: string;
  imageFiles = [];
  disabled = false;
  textBoxDisabled;
  isEdit = false;
  week = [{ 'day': 'Sun' },
  { 'day': 'Mon' },
  { 'day': 'Tue' },
  { 'day': 'Wed' },
  { 'day': 'Thu' },
  { 'day': 'Fri' },
  { 'day': 'Sat' }];
  imgUpload = [];

  editData: any;
  startHour: any;
  endHour: any;
  startMin: any;
  endMin: any;
  operatingStartTime: any;
  operatingEndTime: any;
  imgSrc: any;
  elapseTimeInMinutes: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AmenitiesComponent>,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dialog: MatDialog,
    private appState: fromShared.AppState,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit() {
    this.openForm();
    this.operatingstartHour();
    this.operatingendHour();
  }

  openForm() {
    this.formInit();
    if (this.data) {
      this.emitSelectedAmenities(this.data);
    }
  }
  // getAmentyById(amty_id: any, amty_socid: any): void {
  //   const data = {
  //     amty_id: amty_id,
  //     socID: amty_socid,
  //     // pageNo: 0,
  //     // pagination: 'N',
  //     // searchText: '',
  //     // column: ''
  //   };
  //   const formdata = this.dataTransform.newFormDataArray(data);
  //   this.api.allAmenities(formdata).subscribe((e: any) => {
  //     console.log('e', e);
  //     this.textBoxDisabled = e.BOOKED;
  //   });
  // }

  emitSelectedAmenities(data: any) {
    const data1 = {
      amty_id: data.amty_id,
      socID: data.amty_socid
    };
    const formdata = this.dataTransform.newFormDataArray(data1);
    this.api.allAmenities(formdata).subscribe((e: any) => {
      if (e.BOOKED === 'Y') {
        console.log('this.formGroupName.controldisable()');
        this.amenityForm.controls['amty_capacity'].disable();
        this.amenityForm.controls['amty_amount'].disable();
        this.amenityForm.controls['amty_optstart'].disable();
        this.amenityForm.controls['amty_optend'].disable();
        this.amenityForm.controls['amty_bk_timeslot'].disable();
        this.amenityForm.controls['amty_isbookreq'].disable();
        this.amenityForm.controls['amty_isbookreq'].disable();
        this.disabled = true;
      }
    });
    this.isEdit = true;
    this.editData = data;
    const operatingDay = data.amty_days;
    const days = operatingDay.split(',');
    this.amenityForm.addControl('amty_checkdays', new FormControl([]));
    this.amenityForm.patchValue({
      amty_checkdays: days
    });
    data.amty_image ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + data.amty_image } : this.imageFiles = [];
    this.amenityForm.patchValue(data);
    this.operatingStartTime = data.amty_optstart;
    this.operatingEndTime = data.amty_optend;
    console.log(this.amenityForm.value);
  }

  formInit() {
    this.amenityForm = this.fb.group({
      amty_socid: [this.appState.societyId],
      amty_id: [''],
      amty_name: ['', [Validators.required, Validators.pattern]],
      amty_description: ['', Validators.required],
      amty_isbookreq: ['Y', Validators.required],
      amty_optstart: ['', Validators.required],
      amty_days: [''],
      amty_checkdays: [[]],
      amty_optend: ['', Validators.required],
      amty_bk_timeslot: ['', [Validators.required]],
      amty_capacity: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      amty_amount: ['', [Validators.required, Validators.pattern(/((\d+)+(\.\d+))$/)]],
      amty_image: [],
      amty_isactive: ['Y'],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  selectDays(event, i) {
    const feat = event.source.value;
    if (event.checked) {
      this.amenityForm.controls.amty_checkdays.value.push(feat);
    } else {
      const index = this.amenityForm.controls.amty_checkdays.value.findIndex(x => x === feat);
      this.amenityForm.controls.amty_checkdays.value.splice(index, 1);
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
    this.amenityForm.controls['amty_image'].setValue('');
  }

  onSubmit() {
    console.log('this.amenityForm', this.amenityForm.value);
    if (this.amenityForm.valid) {
      console.log(this.amenityForm.get('amty_checkdays').value);
      const days = this.amenityForm.get('amty_checkdays').value;
      console.log(days);
      
      this.amenityForm.patchValue({ amty_days: days.toString() });
      this.amenityForm.removeControl('amty_checkdays');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.amenityForm.value)
      };
      const formData = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formData.append('imageFile', e);
      });

      this.api.newAmenities(formData).subscribe(response => {
        console.log('response', response);
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.closeForm(true);
        } else {
          this.snackBar.openSnacBar('Something Went Wrong ');
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter all required fields');
    }
  }

  closeForm(ref, deleted?) {
    this.dialogRef.close({ refresh: ref, is_delete: deleted });
    this.editData = '';
  }

  deleteImage() {
    this.imgUpload.splice(0, 1);
    this.amenityForm.controls['amty_image'].setValue('');
    // this.imgSrc = '';
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
          amty_id: this.amenityForm.get('amty_id').value
        };
      }
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.deleteAmenities(formdata).subscribe(response => {
        this.snackBar.openSnacBar('Data Deleted Successfully');
        this.closeForm(true, true);
      });
    });
  } // End of onDelete

  isSelected(value: string): boolean {
    const checkboxValue = (this.amenityForm.get('amty_days').value).split(',').map(String).filter(item =>
      item === value);
    return checkboxValue.length;
  }

  operatingstartHour() {
    this.amenityForm.get('amty_optstart').valueChanges.subscribe(e => {
      this.startHourVal(e);
    });
  }

  startHourVal(e: any) {
    this.operatingStartTime = e;
  }

  operatingendHour() {
    this.amenityForm.get('amty_optend').valueChanges.subscribe(e => {
      this.endHourValue(e);
    });
  }

  endHourValue(e: any) {
    this.operatingEndTime = e;
    const stArr = this.operatingStartTime.split(':');
    // tslint:disable-next-line:radix
    this.startHour = parseInt(stArr[0]);
    // tslint:disable-next-line:radix
    this.startMin = parseInt(stArr[1]);
    const edArr = this.operatingEndTime.split(':');
    // tslint:disable-next-line:radix
    this.endHour = parseInt(edArr[0]);
    // tslint:disable-next-line:radix
    this.endMin = parseInt(edArr[1]);

    // tslint:disable-next-line:radix
    const elapseTime = parseInt(this.operatingEndTime) - parseInt(this.operatingStartTime);
    this.elapseTimeInMinutes = elapseTime * 60;
    this.checkForTime();
  }

  checkForTime() {
    // tslint:disable-next-line
    var bookingHrsInMinutes = this.amenityForm.controls['amty_bk_timeslot'].value * 60;
    if (this.elapseTimeInMinutes !== bookingHrsInMinutes) {
      this.amenityForm.patchValue({
        amty_optend: ''
      });
      this.snackBar.openSnacBar('Data cannot be processed');
    }
    // tslint:disable-next-line:radix
    if (parseInt(this.startHour) > parseInt(this.endHour)) {
      this.amenityForm.patchValue({
        amty_optend: ''
      });
      this.snackBar.openSnacBar('End Time Must Be Greater Than Start Time');
    }
    // tslint:disable-next-line:radix
    if (this.startHour === this.endHour && this.endMin < this.startMin) {
      this.amenityForm.patchValue({
        amty_optend: ''
      });
      this.snackBar.openSnacBar('End Time Must Be Greater Than Start Time');
    }
  }

  setBookingHrs() {
    if (this.amenityForm.controls['amty_bk_timeslot'].value < 9) {
      this.amenityForm.controls['amty_bk_timeslot'].setValue(0 + this.amenityForm.controls['amty_bk_timeslot'].value + ':' + '00');
    } else {
      this.amenityForm.controls['amty_bk_timeslot'].setValue(this.amenityForm.controls['amty_bk_timeslot'].value);
    }
  }
  setBookingCharges() {
    this.amenityForm.controls['amty_amount'].setValue(+ this.amenityForm.controls['amty_amount'].value + '.' + '00');

  }
}
