import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as fromShared from '../../../shared';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-unit-type',
  templateUrl: './unit-type.component.html'
})
export class UnitTypeComponent implements OnInit {
  masterFormGroup: FormGroup;
  unitTypeConf = this.configuration.tableConf.flatType;
  isForm = false;
  isEdit = false;
  dataSourceFn = this.api.allFlatType.bind(this.api);
  filterData;
  open = true;
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

  formInit() {
    this.masterFormGroup = this.fb.group({
      ft_socid: [this.appState.societyId, Validators.required],
      ft_id: [''],
      ft_type: ['', [Validators.required]],
      ft_sqft: ['', Validators.required],
      ft_numbers: ['', Validators.required],
      ft_builtup: ['', Validators.required],
      ft_bedrooms: ['', Validators.required],
      ft_bathrooms: ['', Validators.required],
      ft_balconies: [0, Validators.required],
      ft_const_cost: ['', Validators.required]
    });
  }

  openForm() {
    this.isForm = true;
    if (!this.isEdit) {
      this.formInit();
    }
  }

  closeForm() {
    this.masterFormGroup.reset();
    this.isForm = false;
    this.isEdit = false;
    this.formInit();
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '30%',
        data: [{
          formControlName: 'ft_type',
          val: this.filterData ? this.filterData.ft_type : '',
          type: 'text',
          placeholder: 'Unit Type'
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

  onSubmit() {
    if (this.masterFormGroup.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.masterFormGroup.value)
      };

      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newFlatType(formdata).subscribe(response => {
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

  emitSelected(data) {
    console.log(data);
    this.isEdit = true;
    this.masterFormGroup.patchValue(data);
    this.openForm();
  }

  onDelete(data): void {
    const deletedialog = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });
    deletedialog.afterClosed().subscribe(res => {

      if (res === true) {
        data = {
          socID: this.appState.societyId,
          ft_id: this.masterFormGroup.get('ft_id').value
        };

        const formdata = this.dataTransform.newFormDataArray(data);

        this.api.deleteFlatType(formdata).subscribe(response => {
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
          }
          this.isForm = false;
          this.isEdit = false;
        });
      } else {
        deletedialog.close();
      }

    });
  } // End of onDelete
}
