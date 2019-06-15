import { Component, OnInit } from '@angular/core';
import * as fromShared from '../../../shared';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { successMessage, PopupsService } from '../../../shared';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../../../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
    selector: 'dwlz-request-type',
    templateUrl: './request-type.component.html'
})

export class RequestTypeComponent implements OnInit {

    requestListArr = [];
    list_of_doc = [];
    display: boolean;
    currentItem: string;
    requestForm: FormGroup;
    requiredList = [];
    reqData: any;
    reqDocName: any;
    amount: any;
    duplData: any;
    changeTextColor: boolean;
    displyIcon: boolean;
    constructor(
        private fb: FormBuilder,
        private api: fromShared.ApiService,
        private dataTransfer: fromShared.UtilityService,
        private openSnackBar: PopupsService,
        private dialog: MatDialog,
        private appState: fromShared.AppState,

    ) { }

    ngOnInit() {
        this.initForm();
        this.getRequestList();
    }

    initForm() {
        this.requestForm = this.fb.group({
            doc_amt: ['', Validators.pattern('[0-9]*')],
            documentList: this.fb.array([])
        });
        (this.requestForm.get('documentList'));
    }

    get documentList() {
        return this.requestForm.get('documentList') as FormArray;
    }

    getRequestList() {
        const data = {
            type: 'REQUEST_TYPE'
        };
        const formData = this.dataTransfer.newFormDataArray(data);
        this.api.allRequestList(formData).subscribe((response: any) => {
            this.requestListArr = response.DATA;

        });
    }

    currentRequest(req_data, event) {
        // this.displyIcon=true;
        this.initForm();
        this.reqData = req_data;
        // // document.querySelector("body").style.cssText = "--my-var: inline-block";

        this.reqDocName = this.reqData.lov_displayvalue;
        const postReqData = {
            socID: this.appState.societyId,
            reqType: this.reqData.lov_storevalue
        };
        const formData = this.dataTransfer.newFormDataArray(postReqData);
        this.api.allDocumentList(formData).subscribe((res: any) => {
            if (res.STATUS === 'SUCCESS') {
                this.requiredList = res.DATA;
                this.amount = res.CHARGE;
                this.requestForm.patchValue({
                    doc_amt: this.amount
                });
                this.requiredList.map(item => {
                    this.documentList.push(this.fb.control(item));
                });
                this.display = true;
            }
        });
    }

    selectedCheckbox(event, data) {
        let replacableData;
        if (event.checked) {
            replacableData = {
                rdm_docs: this.requiredList[data].lov_storevalue,
                rdm_request: this.reqData.lov_storevalue,
                rdm_socid: this.appState.societyId
            };
            this.changeTextColor = true;
        } else {
            replacableData = {
                rdm_docs: null,
                rdm_request: null,
                rdm_socid: null
            };
            this.changeTextColor = false;
        }

        this.documentList.at(data).patchValue(replacableData);
    }
    isSelected(item) {
        if (item.rdm_docs !== null && item.rdm_request !== null && item.rdm_socid !== null) {
            this.changeTextColor = true;
            return true;
        } else {
            this.changeTextColor = false;
            return false;
        }
    }
    save() {
        if (this.requestForm.valid) {

            this.duplData = JSON.parse(JSON.stringify(this.documentList.value));
            const data = (this.duplData.filter(
                item => item.rdm_docs !== null && item.rdm_request !== null && item.rdm_socid !== null));
            const dupFrmData = data.map(val => {
                delete val.lov_displayvalue;
                delete val.lov_storevalue;
                return val;
            }
            );
            const postReqData = {
                socID: this.appState.societyId,
                tableData: JSON.stringify(dupFrmData),
                charge: this.requestForm.get('doc_amt').value
            };
            const formData = this.dataTransfer.newFormDataArray(postReqData);
            if (dupFrmData.length === 0) {
                const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
                    width: '350px',
                    height: '250px',
                    panelClass: 'confirm-dialog-container',
                    data: {
                        Heading: 'Confirm',
                        Message: 'Are u Sure you want to continue?'
                    }
                });
                dialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        const postDeleteData = {
                            socID: this.appState.societyId,
                            reqType: this.reqData.lov_storevalue
                        };
                        const formdata = this.dataTransfer.newFormDataArray(postDeleteData);
                        this.api.deleteSingleDocList(formdata).subscribe((responsen: any) => {
                            if (responsen.STATUS === 'SUCCESS') {
                                this.requestForm.reset();
                                this.initForm();
                                // this.openSnackBar.openSnacBar('Data send Successfully')
                                this.display = false;
                            } else if (responsen.STATUS === fromShared.failure) {
                                this.openSnackBar.openSnacBar(responsen.MESSAGE);
                                this.requestForm.reset();
                                this.initForm();
                                this.display = false;
                            }
                        });
                    }
                });
            } else {
                this.api.newSingleSelectedDocList(formData).subscribe((response: any) => {
                    if (response.RESPONSE === 'SUCCESS') {
                        this.requestForm.reset();
                        this.initForm();
                        this.openSnackBar.openSnacBar('Data send Successfully');
                        this.display = false;
                    }
                });
            }
        }
    }
    cancel() {
        this.display = false;
    }
}
