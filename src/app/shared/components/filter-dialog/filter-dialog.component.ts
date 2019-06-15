import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'dwlz-filter-dialog',
  templateUrl: './filter-dialog.component.html'
})
export class FilterDialogComponent implements OnInit {
  filterConf;
  checkboxValue;
  checkboxDisplay;
  filterForm: FormGroup;
  filterData = {};
  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initialConfiguration();
    this.formInit();
    // this.dialogRef.updateSize('80%', '80%');
  }

  onDelete() {
  }

  closeForm() {
    this.dialogRef.close();
  }

  initialConfiguration() {
    if (this.data) {
      this.filterConf = this.data.filter(e => e.search === true);
      this.checkboxValue = this.filterConf.map(e => e.sortValue);
      this.checkboxDisplay = this.filterConf.map(e => e.displayValue);
    }
  }

  formInit() {
    const chekbxCntrls = this.checkboxValue.map(x => this.fb.control(false));
    this.filterForm = this.fb.group({
      filter_search: [''],
      filterCheckbox: this.fb.array(chekbxCntrls)
    });
  }

  onSubmit() {
    const filterables = this.checkboxValue
      .map((e, i) => ({ [e]: this.filterForm.value.filterCheckbox[i] }))
      .filter(e => Object.keys(e).find(key => e[key] === true))
      .map(e => Object.keys(e)[0]);
    this.filterData = {
      formData : this.filterForm.get('filter_search').value,
      sortColumn : filterables
    };
    this.dialogRef.close(this.filterData);
  }

  onClose() {
    this.dialogRef.close();
  }
}
