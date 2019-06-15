import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { WingsComponent } from './wings/wings.component';
import * as fromShared from '../../../shared';
import { AssetsComponent } from './assets/assets.component';
import { AmenitiesComponent } from './amenities/amenities.component';
import { GatesComponent } from './gates/gates.component';
import * as moment from 'moment';
import { DataTableComponent } from '../../../shared';

@Component({
  selector: 'dwlz-soceity-details',
  templateUrl: './society-details.component.html',
})
export class SocietyDetailsComponent implements OnInit {

  societyForm: FormGroup;
  society: any;
  imageFiles = [];
  imgUpload = [];
  isImageClicked = 'N';

  amenitiesDataTransform = [{
    amty_isbookreq: {
      Y: 'Yes',
      N: 'No'
    }
  },
  ];

  gatesDataTransform = [{
    sg_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];

  wingDataTransform = [{
    sw_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];

  assetsDataTransform = [{
    sas_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];

  wingsConf = this.configuration.tableConf.wings;
  amenityConf = this.configuration.tableConf.amenity;
  assetsConf = this.configuration.tableConf.assets;
  gatesConf = this.configuration.tableConf.gate;
  isForm = false;
  isEdit = false;
  currentDate = new Date();

  wingDataSourceFn = this.api.allWings.bind(this.api);
  assetsDataSourceFn = this.api.allAssets.bind(this.api);
  gatesDataSourceFn = this.api.allGates.bind(this.api);
  amenityDataSourceFn = this.api.allAmenities.bind(this.api);

  @ViewChild(DataTableComponent) datatable: DataTableComponent;


  constructor(
    private dialog: MatDialog,
    private api: fromShared.ApiService,
    private configuration: fromShared.ConfigurationService,
    private fb: FormBuilder,
    private snackBar: fromShared.PopupsService,
    private dataTransform: fromShared.UtilityService,
    private appState: fromShared.AppState,

  ) { }


  ngOnInit() {
    this.formInit();
    this.getSociety();
  }

  formInit() {
    this.societyForm = this.fb.group({
      so_societyid: this.appState.societyId,
      so_name: [{ value: '', disabled: true }],
      so_type: [{ value: '', disabled: true }],
      so_registrationid: [{ value: '', disabled: true }],
      so_registration_dt: [{ value: '', disabled: true }],
      so_nbrofunits: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(1), Validators.max(999)]],
      so_noofparkings: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      so_primcode: [''],
      so_seccode: [''],
      so_address: ['', Validators.required],
      so_pincode: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(100000), Validators.max(999999)]],
      so_socimage: [],
      so_isactive: [''],
      so_bankname: ['', [Validators.pattern(/^[a-zA-Z\_\- ]{1,100}$/)]],
      so_branch: ['', [Validators.pattern(/^[a-zA-Z\_\- ]{1,100}$/)]],
      so_bankacno: ['', [Validators.required,
      Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(10000000), Validators.max(999999999999999999)]],
      so_billingfreq: [''],
      so_intmethod: [''],
      so_intperc: [''],
      so_duedays: [''],
      created_dt: [moment(this.currentDate).format('YYYY/MM/DD')],
      update_dt: [moment(this.currentDate).format('YYYY/MM/DD')],
      created_by: ['Admin'],
      update_by: ['Admin']
    });
  }

  openWingsForm(wingData?) {
    const wingsDialogRef = this.dialog.open(WingsComponent, {
      height: '80%',
      panelClass: 'full-width-dialog',
      data: wingData ? wingData : null,
      disableClose: true
    });

    wingsDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  getSociety() {
    const data = {
      socID: this.appState.societyId,
      pageNo: 0,
      pagination: 'N',
      searchText: '',
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.getSociety(formdata).subscribe((e: any) => {
      this.society = e.DATA;
      this.society[0].so_socimage ? this.imageFiles[0] = {
        fileSrc: this.api.imagePath +
          '' + this.society[0].so_socimage
      } : this.imageFiles = [];
      this.societyForm.patchValue(this.society[0]);
    });
  }

  imageUpload(event) {
    this.isImageClicked = 'Y';
    this.imageFiles = Array.from(event.target.files);
    this.imageFiles.map(e => {
      this.imgUpload.push(e);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e);
      fileReader.onload = () => {
        //  (fileReader.result);
        e.fileSrc = fileReader.result;
        return e;
      };
    });
  }

  removeImage(i) {
    this.imageFiles.splice(i, 1);
    this.societyForm.controls['	so_socimage'].setValue('');
  }

  onSubmit() {
    if (this.societyForm.valid) {
      const postPM = {
        socID: this.appState.societyId,
        societyData: JSON.stringify(this.societyForm.getRawValue()),
        updIMG: this.isImageClicked,
        // getRawValue used because form has disabled filled
        // & we have to pass and submit disabled filled's value also
      };
      const formdata = this.dataTransform.newFormDataArray(postPM);
      this.imgUpload.forEach(e => {
        formdata.append('imageFile', e);
      });
      this.api.updateSociety(formdata).subscribe(response => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.getSociety();
          this.snackBar.openSnacBar('Data Added Successfully');
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }

  resetForm() {
    this.societyForm.reset();
    this.formInit();
  }

  emitSelectedWings(data) {
    this.openWingsForm(data);
  }


  openAmenitiesForm(amenityData?: any) {
    const amenitiesDialogRef = this.dialog.open(AmenitiesComponent, {
      height: '80%',
      panelClass: 'full-width-dialog',
      data: amenityData ? amenityData : null,
      disableClose: true
    });

    amenitiesDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  emitSelectedAssets(data) {
    this.openAssetsForm(data);
  }

  openAssetsForm(assetData?) {
    const assetsDialogRef = this.dialog.open(AssetsComponent, {
      height: '80%',                     // changes 21/02/19
      panelClass: 'full-width-dialog',  // changes 21/02/19
      data: assetData ? assetData : null
    });

    assetsDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        // console.log(res);
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  emitSelectedAmenities(data) {
    this.openAmenitiesForm(data);
  }

  openGatesForm(gateData?) {
    const gateDialogRef = this.dialog.open(GatesComponent, {
      height: '80%',                     // changes 21/02/19
      panelClass: 'full-width-dialog',  // changes 21/02/19
      data: gateData ? gateData : null
    });

    gateDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        // console.log(res);
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  emitSelectedGate(data) {
    this.openGatesForm(data);
  }

}
