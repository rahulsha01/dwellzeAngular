import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { PopupsService, ApiService, AppState, UtilityService } from 'src/app/shared';
import * as fromShared from '../../../shared';

@Component({
    selector: 'dwlz-upload',
    templateUrl: './upload.component.html'
})

export class UploadComponent implements OnInit {
    uploadForm: FormGroup;
    uploadFiles = [];
    docUpload = [];
    changeEvent: any;
    @ViewChild('image') input: ElementRef;
    file_ext: any;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private openSnackbar: PopupsService,
        private api: ApiService,
        private appstate: AppState,
        private datatTransform: UtilityService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.uploadForm = this.fb.group({
            overWrite: ['N']
        });
    }


    fileUpload(event) {
        console.log(event.target.files[0]);
        this.file_ext = (event.target.files[0].name).split('.');
        console.log(this.file_ext);
        if (this.file_ext[1] === 'xlsx') {
            this.uploadFiles = Array.from(event.target.files);
            this.uploadFiles.map(e => {
                this.docUpload.push(e);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(e);
                fileReader.onload = () => {
                    return e;
                };
            });
        } else {
            this.uploadFiles = [];
        this.input.nativeElement.value = '';
            this.openSnackbar.openSnacBar('Please Select Only Excel File');
        }
    }

    onChange(event) {
        this.changeEvent = event;
        event.preventDefault();
        console.log(this.changeEvent);
       if (this.uploadForm.controls['overWrite'].value !== 'Y') {
            this.openConfirmDialog();
       } else {
           this.uploadForm.patchValue({
               'overWrite': 'N'
           });
       }
    }

    openConfirmDialog() {
        const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
            width: '450px',
            height: '300px',
            panelClass: 'confirm-dialog-container',
            data: {
                'Heading': 'Message',
                'Message': 'Are u sure you want to delete current primary members and create new members from the file,Please Confirm?'
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.uploadForm.patchValue({
                    'overWrite': 'Y'
                });
                console.log(this.changeEvent);
            } else {
                     this.uploadForm.patchValue({
                        'overWrite': 'N'
                    });
            }
        });
    }

    onSubmit() {
        if ( this.uploadFiles.length > 0) {
            const postUploadData = {
                socID: this.appstate.societyId,
                name: this.file_ext[0],
                overWrite: this.uploadForm.get('overWrite').value
            };
            const formData = this.datatTransform.newFormDataArray(postUploadData);
            this.uploadFiles.map(e => {
                formData.append('file', e);
            });
            this.api.newUploadDocument(formData).subscribe((response: any ) => {
               this.openSnackbar.openSnacBar('Data Upload Successfuly');
            });
        } else {
            this.openSnackbar.openSnacBar('select Atleast one Attachment');
        }
        this.input.nativeElement.value = '';
        this.uploadForm.reset();
        this.initForm();
    }
    reset() {
        this.uploadForm.reset();
        this.uploadFiles = [];
    }

}
