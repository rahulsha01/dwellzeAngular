import { Component, OnInit, Inject } from '@angular/core';
// import * as fromShared from '../../../shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, FormControlName } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService, UtilityService } from '../../services';

import { MatFormFieldModule } from '@angular/material/form-field';
import { $ } from 'protractor';


@Component({
    selector: 'dwlz-service-filter-dialog',
    templateUrl: './service-filter-dialog.component.html'
})
export class ServiceFilterDialogComponent implements OnInit {

    serviceFilterForm: FormGroup;
    vendorArr = [];
    vendorCatListener = true;
    isEdit: boolean;
    editData: any;

    constructor(
        private dialogRef: MatDialogRef<ServiceFilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Array<Object>,
        private fb: FormBuilder,
        private api: ApiService,
        private dataTransform: UtilityService,
    ) {
        //  (data)
    }


    ngOnInit() {
        this.initForm();
        // this.subscribeVendorData();
    }

    initForm() {
        this.serviceFilterForm = this.fb.group({});
        this.data.forEach((x: any) => {
            if (x.type === 'text') {
                this.serviceFilterForm.addControl(x.formControlName, this.fb.control(x.val, Validators.required));
            } else {
                this.serviceFilterForm.addControl(x.formControlName, this.fb.array([], Validators.required));
                if (x.val !== '') {
                    x.val.map(y => {
                        (this.serviceFilterForm.controls[x.formControlName] as FormArray).push(this.fb.control(y));
                    });
                }
            }
        });
    }


    selectedCheckbox($event, controlName, value, i) {
        if ($event.checked) {
            const control = (this.serviceFilterForm.get(controlName) as FormArray);
            control.push(this.fb.control(value));
        }
        if (!$event.checked) {
            const control = (this.serviceFilterForm.get(controlName) as FormArray);
            const index = control.controls.findIndex(x => x.value === value);
            control.removeAt(index);
        }
    }
    selectChecked(data, city, i) {
        const control = (this.serviceFilterForm.get(data).value).filter(x => x === city);
        if (control.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    reset() {
        this.initForm();
        this.serviceFilterForm.reset();
    }
    onSubmit() {
        this.dialogRef.close(this.serviceFilterForm.value);
        this.serviceFilterForm.reset();
        this.initForm();
    }
    closeForm() {
        this.dialogRef.close(this.serviceFilterForm.value);
    }
}
