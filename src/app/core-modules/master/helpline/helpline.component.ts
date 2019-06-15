import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import * as fromShared from '../../../shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'dwlz-helpline',
  templateUrl: './helpline.component.html'
})
export class HelplineComponent implements OnInit {
  title = 'Help Line';
  masterFormGroup: FormGroup;
  helplineConf = this.configuration.tableConf.helpline;
  isForm = false;
  isEdit = false;
  catChangeListener = true;
  restrictInput = false;
  dataSourceFn = this.api.allHelpline.bind(this.api);
  // @Output() selected = new EventEmitter();
  // @ViewChild('DataTableComponent') datatable: DataTableComponent;
  options = [];
  editData;
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
    this.getLovType('');
    this.lovsType();
  }

  lovsType() {
    this.masterFormGroup.get('hp_lovid').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getLovType(e));
  }

  getLovType(value) {
    const data = {
      type: 'HLP',
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

  displayUnitTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit) {
      return this.editData.lov_displayvalue;
    } else {

      const index = this.options.findIndex(e => e.lov_storevalue === id);
      return this.options[index].lov_displayvalue;
    }
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      hp_socid: [this.appState.societyId, Validators.required],
      hp_id: [''],
      hp_lovid: ['', Validators.required],
      hp_number1: ['', Validators.required],
      hp_number2: ['', Validators.required],
      hp_desc: ['', Validators.required]
    });
  }

  openForm() {
    this.isForm = true;
    if (!this.isEdit) {
      this.formInit();
    }
    this.lovsType();
    this.getLovType('');
  }

  closeForm() {
    this.isForm = false;
    this.isEdit = false;
    this.masterFormGroup.reset();
    this.formInit();
  }

  openFilterModal(): void {
    if (this.open) {
      const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
        width: '50%',
        height: '40%',
        data: [{
          formControlName: 'lov_displayvalue',
          val: this.filterData ? this.filterData.lov_displayvalue : '',
          type: 'text',
          placeholder: 'Type'
        },
        {
          formControlName: 'hp_number1',
          val: this.filterData ? this.filterData.hp_number1 : '',
          type: 'text',
          placeholder: 'Primary Contact',
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


  onSubmit() {
    if (this.masterFormGroup.valid) {
      const data = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(this.masterFormGroup.value)
      };
      const formdata = this.dataTransform.newFormDataArray(data);
      this.api.newHelpline(formdata).subscribe(response => {
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
    this.isEdit = true;
    this.editData = data;
    this.masterFormGroup.patchValue(data);
    this.openForm();
  }

  onDelete(data): void {
    const deleteModal = this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        'Heading': 'Confirm',
        'Message': 'Are u sure you want to Continue?'
      }
    });
    deleteModal.afterClosed().subscribe(res => {
      if (res === true) {
        data = {
          socID: this.appState.societyId,
          hp_id: this.masterFormGroup.get('hp_id').value
        };

        const formdata = this.dataTransform.newFormDataArray(data);
        this.api.deleteHelpline(formdata).subscribe((response: any) => {
          this.isForm = false;
          this.isEdit = false;
          if (response.RESPONSE === fromShared.failure) {
            this.snackBar.openSnacBar(response.MESSAGE);
          } else {
            this.snackBar.openSnacBar('Data Deleted Successfully');
          }
          this.formInit();
        });
      } else {
        deleteModal.close();
      }
    });
    // End of onDelete
  }

  onBlur(event) {
    this.catChangeListener = false;
    const inputVal = this.masterFormGroup.get('hp_lovid').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.masterFormGroup.patchValue({
        hp_lovid: '',
      });
    }
  }

  // onSelectionChanged() use with onblur() function
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
  }
}
