import { Component, OnInit, ViewChild } from '@angular/core';
import * as fromShared from '../../../shared';
import { FilterDialogComponent, DataTableComponent, DataTransferService, UtilityService, PopupsService } from '../../../shared';
import { MatDialog, MatInputModule } from '@angular/material';
import * as moment from 'moment';

@Component({
    selector: 'dwlz-vendors',
    templateUrl: './vendors.component.html'
})

export class VendorsComponent implements OnInit {
    rate=3;
    rating= [1,2,3,4,5];
    @ViewChild(DataTableComponent) datatable: DataTableComponent;
    serviceDataSourceFn = this.api.allService.bind(this.api);
    vendorDataSourceFn = this.api.allVendor.bind(this.api);
    serviceConf = this.configuration.tableConf.service;
    vendorConf = this.configuration.tableConf.vendor;
    displayVendors: boolean;
    displayService = true;
    selectedServices: any;
    open = true;
    singleVendor: boolean;
    vendorInfoArr: any;
    metaData;
    filterData = null;
    subServicesArr = [];
    i = 0;
    subServicesData: any;
    prev_disabled = false;
    next_disabled: boolean;
    docArr: any;
    currentDate = new Date();
    cities = ['Mumbai', 'Thane', 'Mulund', 'Vashi', 'Mira Road'];
    subArr = [];
    vendorId: any;
    processSubServicesData = [];
    SubServiceName: any;
    ServiceName: any;
    subServiceAddData: any;
    a: boolean;
    selected: any;
    defsel: any;
    constructor(
        private api: fromShared.ApiService,
        private configuration: fromShared.ConfigurationService,
        private dialog: MatDialog,
        private dataTransfer: UtilityService,
        private openSnackbar: PopupsService,
        private appState: fromShared.AppState,

    ) { }

    ngOnInit() {

    }
    emitSelectedService($event) {
        this.selectedServices = $event.srv_name;
        this.displayService = false;

        this.displayVendors = true;
        const formData = { 'srvID': $event.srv_id };
        this.metaData = formData;
    }
    openServiceFilterModal(): void {
        if (this.open) {
            const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
                width: '50%',
                height: '50%',
                data: [{
                    formControlName: 'service_name',
                    // val: this.filterData ? this.filterData.service_name : (this.selectedServices ? this.selectedServices : ''),
                    val: '',
                    type: 'text',
                    placeholder: 'Service Name'
                },
                {
                    formControlName: 'location_name',
                    val: this.filterData ? this.filterData.location_name : '',
                    type: 'checkbox',
                    placeholder: 'City Location',
                    data: this.cities
                },
                    // {
                    //     formControlName: 'city_name',
                    //     val: this.filterData? this.filterData.city_name: '',
                    //     type:'checkbox',
                    //     placeholder: 'Location'
                    // }
                ]
                ,
                panelClass: 'custom-modalbox',
            });
            dialogRef.afterClosed().subscribe(result => {
                this.filterData = result;
                this.open = true;
            });
            this.open = false;
        }
    }
    openVendorFilterModal(): void {     //changes filter form 08/05/2019
        if (this.open) {
            const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
                width: '50%',
                height: '50%',
                data: [{
                    formControlName: 'service_name',
                    // val: this.filterData ? this.filterData.service_name : (this.selectedServices ? this.selectedServices : ''),
                    val: '',
                    type: 'text',
                    placeholder: 'Vendor Name'
                },
                {
                    formControlName: 'location_name',
                    val: this.filterData ? this.filterData.location_name : '',
                    type: 'checkbox',
                    placeholder: 'City Location',
                    data: this.cities
                },
                    // {
                    //     formControlName: 'city_name',
                    //     val: this.filterData? this.filterData.city_name: '',
                    //     type:'checkbox',
                    //     placeholder: 'Location'
                    // }
                ]
                ,
                panelClass: 'custom-modalbox',
            });
            dialogRef.afterClosed().subscribe(result => {
                this.filterData = result;
                this.open = true;
            });
            this.open = false;
        }
    }
    serviceList() {
        this.displayService = true;
        this.displayVendors = false;
    }
    emitSelectedVendor($event: any) {
        this.displayVendors = false;
        const id = $event.vnd_id;
        const postVendor = {
            vndID: id,
            // pageNo: 0,
            // pagination: 'N',
            // searchText: '',
        };
        const formData = this.dataTransfer.newFormDataArray(postVendor);
        this.getVendorInfo(formData);
        this.getSubServices(formData);
        this.getDocuments(id);
    }

    getVendorInfo(formData) {
        this.api.allSingleVendorInfo(formData).subscribe((res: any) => {
            this.vendorInfoArr = res.DATA[0];
            this.vendorId = this.vendorInfoArr.vnd_id;
            this.singleVendor = true;
        });
    }
    getSubServices(formData) {
        this.api.allVendorSubServices(formData).subscribe((res: any) => {
            res.DATA.map(x => {
                const y = x.SubServices;
                delete x.SubServices;

                y.map(z => {
                    this.subArr.push(Object.assign(z, x));
                    return z;
                });
                return x;
            });
            this.getSubSrv(this.i);
        });
    }
    getSubSrv(index) {
        this.ServiceName = this.subArr[index].srv_name;
        this.subServicesData = this.subArr[index];
        const postData = {'ssID': this.subArr[index].sbs_id};
        const formData = this.dataTransfer.newFormDataArray(postData);
        this.api.allVendorSingleSubServices(formData).subscribe((response: any) => {
            this.subServicesData = response.DATA[0];
        });
        this.getSubServicesAddOn(this.subArr[index]);
        this.getProcessData(this.subArr[index].sbs_id);
        console.log(this.subServicesData);
        this.prev_disabled = this.i === 0 ? true : false;
        this.next_disabled = this.i === this.subArr.length - 1 ? true : false;
    }

    getSubServicesAddOn(data) {
        const postSsData = {
            vndID:  this.vendorId,
            ssID: data.sbs_id,
            srvID: data.srv_id
        };
        const formData = this.dataTransfer.newFormDataArray(postSsData);

        this.api.allVendorSingleSubServicesAddOn(formData).subscribe((response: any) => {
            // console.log(response.DATA);
           response.DATA.map(x => {
               if (x.vs_princingtype === 'F') {
                   x.vs_princingtype = 'Fixed';
               } else if (x.vs_princingtype === 'PH') {
                x.vs_princingtype = 'per Hour';
               } else {
                x.vs_princingtype = 'On Inspection';
               }
               return x;
           });
           this.subServiceAddData = response.DATA[0];
        //    this.defsel = this.subServiceAddData.vs_time;
        });

    }

    getProcessData(ssID) {
        const postPD = {
            vndID: this.vendorId,
            ssID: ssID
        };
        const formData = this.dataTransfer.newFormDataArray(postPD);
        this.api.allProcessVendorSingleSubservices(formData).subscribe((res: any) => {
            this.processSubServicesData = res.DATA;
            console.log(this.processSubServicesData);
        });
    }
    prev() {
        this.getSubSrv(--this.i);
    }
    next() {
        this.getSubSrv(++this.i);
    }
    getDocuments(id) {
        const postDocData = {
            imageType: 'IMG_VENDOR',
            doc_entitytype: 'Vendor',
            doc_entityid: id
        };
        const formData = this.dataTransfer.newFormDataArray(postDocData);
        this.api.allVendorDocument(formData).subscribe((res: any) => {
            this.docArr = res.DATA.map((x) => {
                x.Images.map(y => {
                    y.doc_filepath = this.api.imagePath + y.doc_filepath;
                    return y;
                });
                return x;
            });
        });

    }
    onCancel() {
        this.i = 0;
        this.singleVendor = false;
        this.displayVendors = true;
    }
    onApproved() {
        const postVendor = {
            tableData: JSON.stringify({
                'vs_socid': this.appState.societyId,
                'vs_vndid': this.vendorInfoArr.vnd_id,
                'vs_aprvdt': moment(this.api.currentDate).format('DD/MM/YYYY')
            })
        };
        const formData = this.dataTransfer.newFormDataArray(postVendor);
        this.api.newVendorApproval(formData).subscribe((response: any) => {
            if (response.RESPONSE === fromShared.successMessage) {
                this.openSnackbar.openSnacBar('Vendor Approved');
                this.singleVendor = false;
                this.displayVendors = true;
            }
        });
    }
}
