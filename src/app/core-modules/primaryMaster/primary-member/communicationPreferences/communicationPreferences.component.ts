import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as fromShared from '../../../../shared/services';
import * as moment from 'moment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dwlz-communicationPreferences',
  templateUrl: './communicationPreferences.component.html',
})
export class CommunicationPreferencesComponent implements OnInit {

  communicationPreferencesForm: FormGroup;
  isEdit: boolean;
  status: any;
  action: string;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommunicationPreferencesComponent>,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appState: fromShared.AppState,

  ) { }

  ngOnInit() {
    this.openForm();
  }

  openForm() {
    if (this.data) {
      this.communicationPreferencesForm.patchValue(this.data);
      this.isEdit = true;
    } else {
      this.formInit();
    }
  }

  formInit() {
    this.communicationPreferencesForm = this.fb.group({
      sg_socid: [this.appState.societyId],
      sg_id: [this.appState.societyId],
      sg_name: [],
      sg_desc: [],
      sg_isactive: [],
      created_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      update_by: ['']
    });
  }

  onSubmit() {
    if (this.communicationPreferencesForm.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: this.communicationPreferencesForm.value
      };

      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newCommunicationPreferences(formData).subscribe(response => {
        if (response.RESPONSE === 'Success') {
          this.snackBar.openSnacBar('Data Added Successfully');
          this.dialogRef.close();
        }
      });
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  onDelete() {
    const data = {
      socID: this.appState.societyId,
      sw_id: this.appState.societyId,
      amty_id: this.appState.societyId
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.deleteCommunicationPreferences(formdata).subscribe(response => {
      this.dialogRef.close();
    });
  }
  onChange(ob: MatSlideToggleChange) {
    this.status = ob.checked;
    this.status === true ? this.action = 'Active' : this.action = 'Inactive';
  }
}
