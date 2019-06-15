import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSlideToggleChange, MatAutocompleteSelectedEvent, MatTableDataSource } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-event',
  templateUrl: './event.component.html'
})

export class EventComponent implements OnInit {
  title = 'Events';
  masterFormGroup: FormGroup;
  eventConf = this.configuration.tableConf.event;
  isForm = false;
  isEdit = false;
  dataSourceFn = this.api.allEvent.bind(this.api);
  options = [];
  imageFiles = [];
  imgUpload = [];
  isPaid = [{ 'value': 'Y' }, { 'value': 'N' }];
  paymentType = [{ 'value': 'Cash' }, { 'value': 'Cheque' }];
  editData;
  status = true;
  eventStatus = ['Planned', 'Completed'];
  action = 'Active';
  statusChangeListener = true;
  currentDate = new Date();
  displayStartDate;
  catChangeListener = true;
  restrictInput = false;
  data;
  eventDataTransform = [{
    ev_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];
  filterData;
  open = true;
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
  onChange(ob: MatSlideToggleChange) {
    this.status = ob.checked;
    this.status === true ? this.action = 'Active' : this.action = 'Inactive';
  }

  ngOnInit() {
    this.formInit();
    this.lovsType();
  }

  lovsType() {
    this.masterFormGroup.get('ev_pymttype').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getLovType(e));
  }

  getLovType(value) {
    const data = {
      type: 'PYMNT_TYPE',
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allLovs(formdata).subscribe((e: any) => {
      this.options = e.DATA;
    });

  }

  displayPYTFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.statusChangeListener) {
      return this.editData.pymnt_type;
    } if (!this.statusChangeListener) {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    } else {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    }
  }

  onBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('ev_pymttype').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        ev_pymttype: '',
      });
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  payTypeValueChangeFn() {
    this.statusChangeListener = false;
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      ev_socid: [this.appState.societyId, Validators.required],
      ev_id: [''],
      ev_name: ['', [Validators.required, Validators.pattern]],
      ev_desc: ['', Validators.required],
      ev_image: [],
      ev_startdate: ['', Validators.required],
      ev_enddate: ['', Validators.required],
      ev_starttime: ['', Validators.required],
      ev_endtime: ['', Validators.required],
      ev_minreq: [''],
      ev_paid: ['', Validators.required],
      ev_pymttype: [''],
      ev_favourof: [''],
      ev_amount: ['', Validators.required],
      ev_isactive: [''],
      // created_dt: [this.api.currentDate],
      // created_by: ['Admin'],
      // update_dt: [this.api.currentDate],
      // update_by: ['Admin']
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  openForm() {
    this.isForm = true;
    this.getLovType('');
  }

  closeForm() {
    this.isForm = false;
    this.masterFormGroup.reset();
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
      this.snackBar.openSnacBar('Please fill Proper Date');
      this.masterFormGroup.patchValue({
        ev_startdate: ''
      });
    }
  }

  endDateChecker(event) {
    const selectDate = moment(event).format('YYYY/MM/DD');
    const currentDate = moment(this.currentDate).format('YYYY/MM/DD');
    if (selectDate < this.displayStartDate) {
      this.snackBar.openSnacBar('Please fill Proper End Date');
      this.masterFormGroup.patchValue({
        ev_enddate: ''
      });
    }
  }
  onSubmit() {
    if (this.masterFormGroup.valid) {
      this.status === true ? this.masterFormGroup.patchValue({ ev_isactive: 'Y' }) : this.masterFormGroup.patchValue({ ev_isactive: 'N' });
      const postData = this.masterFormGroup.getRawValue();
      postData.ev_startdate = moment(postData.ev_startdate).format('DD/MM/YYYY');
      postData.ev_enddate = moment(postData.ev_enddate).format('DD/MM/YYYY');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postData)
      };

      const formdata = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formdata.append('imageFile', e);
      });
      // const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newEvent(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.isForm = false;
          // this.snackBar.openSnacBar('Successfully');
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    this.isEdit = true;
    this.editData = data;
    data.ev_startdate = new Date(data.ev_startdate.split('/').reverse().join('/'));
    data.ev_enddate = new Date(data.ev_enddate.split('/').reverse().join('/'));
    data.ev_image ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + data.ev_image } : this.imageFiles = [];
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
    })
      .afterClosed().subscribe(res => {
        if (res === true) {
          data = {
            socID: this.appState.societyId,
            ev_id: this.masterFormGroup.get('ev_id').value
          };
        }
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteEvent(formdata).subscribe(response => {
          this.isForm = false;
          this.snackBar.openSnacBar('Data Deleted Successfully');
          this.formInit();
        });
      });
  } // End of onDelete

  imageUpload(event) {
    this.imageFiles = Array.from(event.target.files);
    this.imageFiles.map(e => {
      this.imgUpload.push(e);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e);
      fileReader.onload = () => {
        // console.log(fileReader.result);
        e.fileSrc = fileReader.result;
        return e;
      };
    });
    console.log(this.imageFiles);
  }

  removeImage(i) {
    this.imageFiles.splice(i, 1);
    this.masterFormGroup.controls['ev_image'].setValue('');
  }

  radioChange(e) {
    console.log('e:', e);

    this.masterFormGroup.patchValue({
      ev_paid: e
    });
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '60%',
        data: [{
          formControlName: 'ev_name',
          val: this.filterData ? this.filterData.ev_name : '',
          type: 'text',
          placeholder: 'Name'
        },
        {
          formControlName: 'location_name',
          val: this.filterData ? this.filterData.location_name : '',
          type: 'checkbox',
          placeholder: 'Filter By',
          data: this.eventStatus
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

}
