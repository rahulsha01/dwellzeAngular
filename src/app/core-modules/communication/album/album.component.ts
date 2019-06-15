import { Component, OnInit, ɵConsole, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as fromShared from '../../../shared';
import { UtilityService, ConfigurationService } from '../../../shared';
import * as moment from 'moment';
@Component({
    selector: 'dwlz-album',
    templateUrl: './album.component.html'
})

export class AlbumComponent implements OnInit {
    no_of_album;
    no_of_images;
    imageFiles = [];
    createAlbm: boolean;
    imgSrc;
    imgUpload = [];
    albumForm: FormGroup;
    hide: any;
    albumCount = 0;
    albumConf = this.configuration.tableConf.album;
    dataSourceFn = this.api.allAlbum.bind(this.api);
    @ViewChild('image') input: ElementRef;
    constructor(
        private fb: FormBuilder,
        private api: fromShared.ApiService,
        private appState: fromShared.AppState,
        private dataTransform: UtilityService,
        private configuration: ConfigurationService
    ) { }

    ngOnInit() {
        // this.getAlbum();
        this.initForm();
    }

    initForm() {
        this.albumForm = this.fb.group({
            alb_socid: [this.appState.societyId],
            alb_id: [''],
            alb_name: [],
            alb_date: [moment(this.api.currentDate).format('DD/MM/YYYY')]
        });
    }

    getAlbumDetails() {
        const data = {
            socID: this.appState.societyId,
            pageNo: 0,
            pagination: 'N',
            searchText: '',
            column: ''
        };
        const formData = this.dataTransform.newFormDataArray(data);
        this.api.getSociety(formData).subscribe((response: any) => {
            this.no_of_album = response.DATA[0].Membership_Plan[0].mp_noofalbums;
            this.no_of_images = response.DATA[0].Membership_Plan[0].mp_photosperalbum;
        });
        this.createAlbm = this.albumCount === 0 ? true : false;
        this.hide = this.albumCount === 0 ? true : false;
    }

    getAlbum() {
        const postData = {
            socID: this.appState.societyId
        };
        const formData = this.dataTransform.newFormDataArray(postData);
        this.api.allAlbum(formData).subscribe((respone: any) => {
            if (respone.DATA.length > 0) {
                console.log(respone.DATA);
                this.createAlbm = false;
                this.hide = false;
            } else {
                this.createAlbm = true;
                this.getAlbumDetails();
            }
        });
    }

    addAlbum() {
        this.imageFiles = [];
        this.hide = true;
        this.createAlbm = true;
    }

    imageUpload(event) {
        console.log(this.imageFiles);
        this.imageFiles = Array.from(event.target.files);
        if (this.imageFiles.length <= 25) {
            console.log(event.target.files);
            console.log(this.imageFiles);
            this.imageFiles.map(e => {
                this.imgUpload.push(e);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(e);
                fileReader.onload = () => {
                    // console.log(fileReader.result);
                    e.fileSrc = fileReader.result;
                    return e;
                };
            });

        } else {
            this.refreshImageArr();
        }
        console.log(this.imageFiles);
    }

    removeImage(i) {
        this.imageFiles.splice(i, 1);
    }
    refreshImageArr() {
        this.imageFiles = [];
        this.input.nativeElement.value = '';
    }
    emitSelected(data) {
        this.imageFiles = [];
        this.createAlbm = true;
        data.Images ? this.getImage(data) : this.imageFiles = [];
        this.albumForm.patchValue(data);

    }
    getImage(data) {
        console.log(data);
        data.Images.map(x => {
            this.imageFiles.push( { fileSrc: this.api.imagePath + '' + x.doc_filepath });
        });
        console.log(this.imageFiles);
    }
    onSubmit() {
        console.log(this.imageFiles);
        const postAlbumData = {
            socID: this.appState.societyId,
            tableData: JSON.stringify(this.albumForm.value)
        };
        const formData = this.dataTransform.newFormDataArray(postAlbumData);
        this.imgUpload.forEach(e => {
            formData.append('imageFile', e);
        });

        this.api.newAlbum(formData).subscribe((response: any) => {
            if (response.RESPONSE === fromShared.successMessage) {
                this.albumCount = this.albumCount + 1;
                this.hide = this.albumCount < this.no_of_album ? false : true;
                this.createAlbm = false;
                this.albumForm.reset();
                this.imageFiles = [];
            }
        });
    }
    closeForm() {
        this.createAlbm = false;
        this.hide = false;
        // this.hide = this.albumCount < this.no_of_album ? false : true;
    }
}