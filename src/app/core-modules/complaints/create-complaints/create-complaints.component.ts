import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-create-complaints',
  templateUrl: './create-complaints.component.html'
})
export class CreateComplaintsComponent implements OnInit {
  masterFormGroup: FormGroup;
  title = 'Society committee';
  complainConf = this.configuration.tableConf.complain;
  isForm = true;
  isEdit = false;
  editData;
  options = [];
  dataSourceFn = this.api.allComplain.bind(this.api);
  catChangeListener = true;
  editDataForIntit;
  initiateByOptions = [];
  optionsPM = [];
  comp_status: boolean;
  restrictInput = false;
  primaryMemListener = true;
  editDataPM;
  @ViewChild('picker1') assignedpicker;
  imageFiles = [];
  imgUpload = [];

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
    this.subscribePrimaryMember();
    this.getComp_Type('');
    this.getPrimaryMember('');
  }

  subscribeUnitType() {
    this.masterFormGroup.get('comp_cat').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getComp_Type(e));
  }

  initiateByValueChangeFn() {
    this.catChangeListener = false;
  }

  displayUnitTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.catChangeListener) {
      return this.editData.lov_displayvalue;
    } if (!this.catChangeListener) {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    } else {
      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    }
  }

  radioChange(e) {
    this.masterFormGroup.patchValue({
      comp_isactive: e
    });
  }

  getComp_Type(value) {
    const data = {
      socID: this.appState.societyId,
      type: 'COMP_TYPE',
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

  formInit() {
    this.masterFormGroup = this.fb.group({
      comp_id: [''],
      comp_socid: [this.appState.societyId],
      comp_pmid: [''],
      comp_sno: [''],
      comp_date: [this.api.currentDate],
      comp_cat: ['', Validators.required],
      comp_title: ['', Validators.required],
      comp_desc: ['', Validators.required],
      comp_relatedto: ['C', Validators.required],
      comp_isurgent: ['Y', Validators.required],
      comp_status: ['O', Validators.required],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  // openForm() {
  //   this.isForm = true;
  //   this.catChangeListener = true;
  //   this.primaryMemListener = true;
  //   this.getComp_Type('');
  //   this.getPrimaryMember('');
  // }

  resetForm() {
    // this.isForm = false;
    // this.isEdit = false;
    // this.catChangeListener = true;
    // this.primaryMemListener = true;
    this.masterFormGroup.reset();
    this.imageFiles = [];
    this.formInit();
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(fromShared.FilterDialogComponent, {
      width: '300px',
      height: '200px',
      data: {
        dataKey: this.complainConf.columns
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  assignedDateModal() {
    this.assignedpicker.open();
  }

  onBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('comp_cat').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        comp_cat: '',
      });
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onSelectionNameChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.masterFormGroup.valid) {
      const postData = this.masterFormGroup.getRawValue();
      postData.comp_date = moment(postData.comp_date).format('DD/MM/YYYY');
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postData)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formdata.append('imageFile', e);
      });
      this.api.newComplain(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.imageFiles = [];
          formDirective.resetForm();
          // this.isForm = false;
          this.masterFormGroup.reset();
          this.formInit();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  emitSelected(data) {
    console.log(data);
    this.isEdit = true;
    this.editData = data;
    this.editDataPM = data;
    this.editDataForIntit = data;
    const compDateObj = data.comp_date.split('/').reverse().join('/');
    data.comp_date = new Date(compDateObj);
    this.masterFormGroup.patchValue(data);
    // this.openForm();
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
          comp_id: this.masterFormGroup.get('comp_id').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteComplain(formdata).subscribe((response: any) => {
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

  subscribePrimaryMember() {
    this.masterFormGroup.get('comp_pmid').valueChanges.pipe(
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

  primaryMemChangeFn() {
    this.primaryMemListener = false;
  }

}
