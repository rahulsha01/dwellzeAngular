import { Component, OnInit, Injectable, Inject, Input } from '@angular/core';
import {
  MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSlideToggleChange,
  DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS
} from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as fromShared from '../../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { keyframes } from '@angular/animations';
import { DataTransferService } from '../../../../shared/services';
import { MatConfirmDialogComponent } from '../../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@Component({
  selector: 'dwlz-family',
  templateUrl: './family.component.html',
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class FamilyComponent implements OnInit {

  familyForm: FormGroup;
  isEdit = false;
  currentDate = new Date();
  status: boolean;
  action: string;
  editData;
  memId: any;
  dataSourceFn = this.api.allFamily.bind(this.api);
  imageFiles = [];
  imgUpload = [];
  options = [];
  @Input() pm_ID: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FamilyComponent>,
    private api: fromShared.ApiService,
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dialog: MatDialog,
    private dataTransfer: DataTransferService,
    private appState: fromShared.AppState,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    // tslint:disable-next-line:no-unused-expression
    this.getMemId();
    this.openForm();
    // this.lovsType();
    this.getLovType('');
  }

  openForm() {
    this.formInit();
    // this.lovsType();
    // this.getLovType('');
    if (this.data) {
      // this.lovsType();
      // this.getLovType('');
      this.emitSelectedFamily(this.data);
    }
    // this.lovsType();
    this.getLovType('');
  }

  formInit() {
    this.familyForm = this.fb.group({
      mf_id: [''],
      mf_socid: [this.appState.societyId],
      mf_pmid: [this.memId],
      mf_firstname: [''],
      mf_lastname: [''],
      mf_email: [''],
      mf_gender: ['M'],
      mf_mobile: [''],
      mf_dob: [''],
      mf_profession: [''],
      mf_profdesc: [''],
      mf_relation: [''],
      mf_sms: ['Y'],
      mf_notify: ['Y'],
      mf_main: ['N'],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['admin']
    });
  }

  getMemId() {
    this.dataTransfer.memId.subscribe(response => {
      this.memId = response;
    });
  }

  // lovsType() {
  //   this.familyForm.get('mf_relation').valueChanges.pipe(
  //     distinctUntilChanged(),
  //     debounceTime(300)
  //   ).subscribe(e => this.getLovType(e));
  // }

  getLovType(value) {
    const data = {
      type: 'FAMILY_RELATION',
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

  onSubmit() {
    if (this.familyForm.valid) {
      this.familyForm.value.mf_dob = this.familyForm.value.mf_dob.format('DD/MM/YYYY');
      const data = {
        socID: this.appState.societyId,
        pmID: this.familyForm.get('mf_pmid').value,
        tableData: JSON.stringify(this.familyForm.value)
      };
      // const formData = this.dataTransform.newFormDataArray(data);
      const formData = this.dataTransform.newFormDataArray(data);
      this.imgUpload.forEach(e => {
        formData.append('imageFile', e);
      });
      this.api.newFamily(formData).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.dataTransfer.memId = this.familyForm.get('mf_pmid').value;
          this.closeForm(true);
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  closeForm(ref, deleted?) {
    // console.log(true);
    this.dialogRef.close({ refresh: ref, is_delete: deleted });
    this.editData = '';
  }

  emitSelectedFamily(data) {
    this.isEdit = true;
    this.editData = data;
    this.data.mf_dob = moment(this.data.mf_dob, 'DD/MM/YYYY');
    data.doc_filepath ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + data.doc_filepath } : this.imageFiles = [];
    this.familyForm.patchValue(data);
  }


  imageUpload(event) {
    this.imageFiles = Array.from(event.target.files);
    this.imageFiles.map(e => {
      this.imgUpload.push(e);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e);
      fileReader.onload = () => {
        e.fileSrc = fileReader.result;
        return e;
      };
    });
  }

  removeImage(i) {
    this.imageFiles.splice(i, 1);
    this.familyForm.controls[''].setValue('');
  }

  onDelete(data): void {
    const deleteDialog = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });
    deleteDialog.afterClosed().subscribe(res => {
      if (res === true) {
        data = {
          socID: this.appState.societyId,
          mf_id: this.familyForm.get('mf_id').value,
          pmID: this.familyForm.get('mf_pmid').value
        };
        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteFamily(formdata).subscribe((response: any) => {
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
            this.closeForm(true);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
            this.closeForm(true, true);
          }
        });
      } else {
        deleteDialog.close();
      }
    });
  } // End of onDelete

  radioChange(e) {
    this.familyForm.patchValue({
      sw_isactive: e
    });
  }
}
