import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromShared from '../../../../shared';
import * as moment from 'moment';
import { MatConfirmDialogComponent } from '../../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { DataTransferService } from '../../../../shared/services';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
@Component({
  selector: 'dwlz-vehicle',
  templateUrl: './vehicle.component.html',
})
export class VehicleComponent implements OnInit {

  vehicleForm: FormGroup;
  memId: any;
  isEdit = false;
  status: boolean;
  action: string;
  week = [{ 'day': 'Sun' }, { 'day': 'Mon' }, { 'day': 'Tue' }, { 'day': 'Wed' }, { 'day': 'Thu' }, { 'day': 'Fri' }, { 'day': 'Sat' }];
  vehicleConf = this.configuration.tableConf.vehicle;
  dataSourceFn = this.api.allVehicle.bind(this.api);
  vehicleModel = [];
  editVehModal;
  modalInputListener = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleComponent>,
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
    this.getMemId();
    this.openForm();
    this.getVehModal();
  }

  getVehModal() {
    this.vehicleForm.get('mv_brand').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getVehBrand(e));
  }

  getVehBrand(value) {
    const data = {
      socID: this.appState.societyId,
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };

    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.getVehBrandData(formdata).subscribe((e: any) => {
      this.vehicleModel = e.DATA;
    });
  }

  inputBrandListener() {
    this.modalInputListener = false;
  }

  displayVehBrandFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.modalInputListener) {
      return this.editVehModal;
    } if (!this.modalInputListener) {
      const index = this.vehicleModel.findIndex(e => e.mv_brand === id);
      return this.vehicleModel[index].mv_brand;
    } else {
      const index = this.vehicleModel.findIndex(e => e.mv_brand === id);
      return this.vehicleModel[index].mv_brand;
    }
  }

  openForm() {
    this.formInit();
    this.getVehBrand('');
    if (this.data) {
      this.isEdit = true;
      this.vehicleForm.patchValue(this.data);
      this.editVehModal = this.data.mv_brand;
  }
}

  formInit() {
    this.vehicleForm = this.fb.group({
      mv_socid: [this.appState.societyId],
      mv_id: [''],
      mv_pmid: [this.memId],
      mv_cat: ['2W'],
      mv_brand: ['', Validators.required],
      mv_no: ['', [Validators.pattern(/^[a-zA-Z0-9\_\- ]{8,30}$/)]],
      mv_model: ['', Validators.required],
      mv_parking: ['', Validators.required],
      mv_isactive: ['Y'],
      created_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('YYYY/MM/DD')],
      update_by: ['Admin']
    });
  }

  getMemId() {
    this.dataTransfer.memId.subscribe(response => {
      this.memId = response;
    });
  }
  onSubmit() {
    if (this.vehicleForm.valid) {
      const data = {
        socID: this.appState.societyId,
        pmID: this.vehicleForm.get('mv_pmid').value,
        tableData: JSON.stringify(this.vehicleForm.value)
      };

      const formData = this.dataTransform.newFormDataArray(data);
      this.api.newVehicle(formData).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.dataTransfer.memId = this.vehicleForm.get('mv_pmid').value;
          this.snackBar.openSnacBar('Data Added Successfully');
          this.closeForm(true);
          // this.modalInputListener = true;
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }


  closeForm(ref, deleted?) {
    this.modalInputListener = true;
    this.dialogRef.close({ refresh: ref, is_delete: deleted });
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
          mv_id: this.vehicleForm.get('mv_id').value,
          pmID: this.vehicleForm.get('mv_pmid').value
        };

        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteVehicle(formdata).subscribe((response: any) => {
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
  }// End of onDelete

  onChange(ob: MatSlideToggleChange) {
    this.status = ob.checked;
  }

  radioChange(e) {
    this.vehicleForm.patchValue({
      mv_isactive: e
    });
  }
}
