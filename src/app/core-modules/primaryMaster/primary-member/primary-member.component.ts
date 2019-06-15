import { Component, OnInit, ViewChild, TemplateRef, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { FamilyComponent } from './family/family.component';
import * as fromShared from '../../../shared';
import { StaffComponent } from './staff/staff.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { CommunicationPreferencesComponent } from './communicationPreferences/communicationPreferences.component';
import * as moment from 'moment';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { DataTableComponent } from '../../../shared';
@Component({
  selector: 'dwlz-primary-member',
  templateUrl: './primary-member.component.html',
})
export class PrimaryMemberComponent implements OnInit {
  primaryMemberConf = this.configuration.tableConf.primaryMember;
  primaryMemberForm: FormGroup;
  communicationPreferencesForm: FormGroup;
  familyConf = this.configuration.tableConf.family;
  vehicleConf = this.configuration.tableConf.vehicle;
  staffConf = this.configuration.tableConf.staff;
  communicationPreferencesConf = this.configuration.tableConf.gate;
  isForm = false;
  isEdit = false;
  tabView = false;
  primaryID: string;
  testVariable;
  dataSourceFn = this.api.allPrimaryMember.bind(this.api);
  familyDataSourceFn = this.api.allFamily.bind(this.api);
  vehicleDataSourceFn = this.api.allVehicle.bind(this.api);
  staffDataSourceFn = this.api.allStaff.bind(this.api);
  communicationPreferencesDataSourceFn = this.api.allCommunicationPreferences.bind(this.api);
  primaryForm: boolean;
  editData;
  wingEditable;
  restrictInput = false;
  flatTypeListener = true;
  flatWingListener = true;
  minDate = new Date();
  options = [];
  wingData = [];
  open = true;
  filterData = null;
  // filter_pm_name;
  // filter_pm_mobile;
  // filter_pm_flatno;
  // filter_pm_profession;1
  @ViewChild('flatTypeDisInput') flatTypeDisInput: ElementRef;
  @ViewChild('picker1') startpicker;
  @ViewChild('picker2') dobpicker;
  @ViewChild(DataTableComponent) datatable: DataTableComponent;
  imageFiles = [];
  imgUpload = [];
  staffDataTransform = [{
    sv_gender: {
      M: 'Male',
      F: 'Female'
    },
  },
  {
    ms_active: {
      Y: 'Active',
      N: 'Inactive'
    }
  }
  ];

  vehicleDataTransform = [{
    mv_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];

  constructor(
    private dialog: MatDialog,
    private api: fromShared.ApiService,
    private configuration: fromShared.ConfigurationService,
    private fb: FormBuilder,
    private dataTransform: fromShared.UtilityService,
    private snackBar: fromShared.PopupsService,
    private dataTransfer: fromShared.DataTransferService,
    private appState: fromShared.AppState,

    // private event: MatAutocompleteSelectedEvent
  ) { }

  ngOnInit() {
    this.formInit();
    this.subscribeUnitType();
    this.getWing();
  }

  subscribeUnitType() {
    this.primaryMemberForm.get('pm_flattype').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(e => this.getFlatType(e));
  }

  // switchTab(event){
  //   if(event.index === 4){
  //     this.initForm();
  //   }
  // }
  // applySearchFilter(filterValue: string) {
  //   console.log('filterValue: ', filterValue);
  // }
  getFlatType(value) {
    const data = {
      socID: this.appState.societyId,
      pageNo: 0,
      pagination: 'N',
      searchText: value,
      column: ''
    };

    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allFlatType(formdata).subscribe((e: any) => {
      this.options = e.DATA;
    });

  }

  getWing() {
    const data = {
      socID: this.appState.societyId,
      pageNo: 0,
      pagination: 'N',
      searchText: '',
      column: ''
    };
    const formdata = this.dataTransform.newFormDataArray(data);
    this.api.allWings(formdata).subscribe((e: any) => {
      this.wingData = e.DATA;
      console.log(this.wingData);
    });
  }

  openForm() {
    this.subscribeUnitType();
    this.getWing();
    this.imageFiles = this.isEdit ? this.imageFiles : [];
    console.log(this.imageFiles);
    this.isForm = true;
    this.tabView = true;
    this.primaryForm = true;
    this.flatTypeListener = true;
  }


  closeForm() {
    const a = null;
    this.isForm = false;
    this.tabView = false;
    this.isEdit = false;
    this.primaryForm = false;
    this.flatTypeListener = true;
    this.dataTransfer.memId = a;
    this.primaryMemberForm.reset();
    this.formInit();
  }

  formInit() {
    this.primaryMemberForm = this.fb.group({
      pm_id: [''],
      pm_societyid: [this.appState.societyId],
      pm_membershipid: ['', [Validators.pattern(/^[a-zA-Z0-9_-]{5,15}$/)]],
      pm_firstname: ['', [Validators.required, Validators.pattern]],
      pm_lastname: ['', [Validators.required, Validators.pattern]],
      pm_gender: ['M', Validators.required],
      pm_mobile: ['', Validators.required],
      pm_dob: ['', Validators.required],
      pm_email: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pm_profession: ['', Validators.required],
      pm_intercom: ['', Validators.required],
      pm_langaugepreferred: [''],
      pm_professionaldescription: [''],
      pm_image: [''],
      pm_wing: ['', Validators.required],
      pm_flatno: ['', Validators.required],
      pm_flattype: ['', Validators.required],
      pm_flatcarpetarea: ['', Validators.required],
      pm_flatpurchase: ['', Validators.required],
      pm_sharecertificatestartno: ['', [Validators.pattern(/^[a-z0-9_-]{5,8}$/)]],
      pm_sharecertificateendno: ['', [Validators.pattern(/^[a-z0-9_-]{5,8}$/)]],
      pm_isactive: ['Y'],
      pm_comm_email: [],
      pm_comm_sms: [],
      pm_noti_visitor_self: [],
      pm_noti_visitor_spouse: [],
      pm_noti_billpay_self: [],
      pm_noti_billpay_spouse: [],
      pm_noti_staff_self: [],
      pm_noti_staff_spouse: [],
      created_dt: [this.api.currentDate],
      created_by: ['admin'],
      update_dt: [this.api.currentDate],
      update_by: ['admin']
    });
  }

  openFamilyForm(data?: any) {
    const familyData = data;
    const familyDialogRef = this.dialog.open(FamilyComponent, {
      height: '80%',
      panelClass: 'full-width-dialog',
      data: familyData ? familyData : null,
      disableClose: true
    });

    familyDialogRef.afterClosed().subscribe((res: any) => {
      if (res.refresh) {
        console.log(res.refresh);
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  animationEnd(e) {
    //  (e);
  }

  displayUnitTypeFn(id) {
    if (!id) {
      return '';
    }
    if (this.isEdit && this.flatTypeListener) {
      return this.editData;
    } if (!this.flatTypeListener) {
      const index = this.options.findIndex(e => e.ft_id === id);
      this.primaryMemberForm.patchValue({
        pm_flatcarpetarea: this.options[index].ft_sqft
      });
      return this.options[index].ft_type;
    } else {
      const index = this.options.findIndex(e => e.ft_id === id);
      this.primaryMemberForm.patchValue({
        pm_flatcarpetarea: this.options[index].ft_sqft
      });
      return this.options[index].ft_type;
    }
  }

  onBlur(event) {
    this.flatTypeListener = false;
    const inputVal = this.primaryMemberForm.get('pm_flattype').value;
    if (this.restrictInput === false || inputVal.length !== 36) {
      this.primaryMemberForm.patchValue({
        pm_flattype: '',
        pm_flatcarpetarea: ''
      });
    }
  }

  flatTypeVal(ev) {
    this.flatTypeListener = false;
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.restrictInput = true;
    const flatId = event.option.value;
    const carpetArea = this.options.filter(item => {
      // tslint:disable-next-line:no-unused-expression
      item.ft_id === flatId;
    });
  }

  radioChange(e, value) {
    if (value === 1) {
      this.primaryMemberForm.patchValue({
        pm_isactive: e.source.value
      });
    }
    if (value === 2) {
      this.primaryMemberForm.patchValue({
        pm_gender: e.source.value
      });
    }
  }

  onSubmit() {
    if (this.primaryMemberForm.valid) {
      const postPrimaryData = this.primaryMemberForm.getRawValue();
      postPrimaryData.pm_dob = moment(postPrimaryData.pm_dob).format('DD/MM/YYYY');
      postPrimaryData.pm_flatpurchase = moment(postPrimaryData.pm_flatpurchase).format('DD/MM/YYYY');
      const postPM = {
        socID: this.appState.societyId,
        tableData: JSON.stringify(postPrimaryData)
      };
      const formdata = this.dataTransform.newFormDataArray(postPM);

      this.imageFiles.map(e => {
        console.log(e);
        // if(this.isEdit){
        //   const arr = e.fileSrc.split(',');
        //   e.fileSrc = arr[1]
        // }
        formdata.append('imageFile', e);
      });
      this.api.newPrimaryMember(formdata).subscribe((response: any) => {
        if (response.RESPONSE === fromShared.successMessage) {
          this.dataTransfer.memId = null;
          console.log('pop');
          this.snackBar.openSnacBar('Data Added Successfully');
          this.tabView = false;
          this.primaryMemberForm.reset();
        }
      });
    } else {
      this.snackBar.openSnacBar('Enter Valid  Details');
    }
  }
  resetForm() {
    this.primaryMemberForm.reset();
  }


  openFilterModal(value): void {
    if (value === 'primarymember') {
      if (this.open) {
        const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
          width: '50%',
          height: '60%',
          data: [{
            formControlName: 'pm_firstname',
            val: this.filterData ? this.filterData.pm_firstname : '',
            type: 'text',
            placeholder: 'Name'
          },
          {
            formControlName: 'pm_profession',
            val: this.filterData ? this.filterData.pm_profession : '',
            type: 'text',
            placeholder: 'Professsion',
          },
          {
            formControlName: 'pm_mobile',
            val: this.filterData ? this.filterData.pm_mobile : '',
            type: 'text',
            placeholder: 'Mobile Number'
          },
          {
            formControlName: 'pm_flatno',
            val: this.filterData ? this.filterData.pm_flatno : '',
            type: 'text',
            placeholder: 'Flat No'
          }
          ]
          ,
          panelClass: 'custom-modalbox',
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          this.filterData = result;
          this.open = true;
        });
        this.open = false;
      }
    } else {
      if (this.open) {
        const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
          width: '50%',
          height: '60%',
          data: [{
            formControlName: 'sv_name',
            val: this.filterData ? this.filterData.sv_name : '',
            type: 'text',
            placeholder: 'Name'
          },
          {
            formControlName: 'sv_cat',
            val: this.filterData ? this.filterData.sv_cat : '',
            type: 'text',
            placeholder: 'Category',
          }
          ]
          ,
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
  }
  emitSelectedFamily(data) {
    this.dataTransfer.memId = data.mf_pmid;
    this.primaryMemberForm.patchValue(data);
    this.openFamilyForm(data);
  }

  emitSelectedVehicle(data) {
    this.dataTransfer.memId = data.mv_pmid;
    this.primaryMemberForm.patchValue(data);
    this.openVehicleForm(data);
  }

  emitSelectedPrimary(data) {
    console.log(data);
    this.isEdit = true;

    this.editData = data.ft_type;
    const dataObj = data;
    this.primaryMemberForm.patchValue({
      pm_wing: dataObj.sw_id
    });
    this.dataTransfer.memId = data.pm_id;
    if (dataObj.pm_flatpurchase !== '' || dataObj.pm_flatpurchase !== undefined || dataObj.pm_flatpurchase !== null) {
      const purchaseDate = dataObj.pm_flatpurchase.split('/').reverse().join('/');
      dataObj.pm_flatpurchase = new Date(purchaseDate);
    }
    if (dataObj.pm_dob !== '' || dataObj.pm_dob !== undefined || dataObj.pm_dob !== null) {
      const dob = dataObj.pm_dob.split('/').reverse().join('/');
      dataObj.pm_dob = new Date(dob);
    }
    dataObj.doc_filepath ? this.imageFiles[0] = { fileSrc: this.api.imagePath + '' + dataObj.doc_filepath } : this.imageFiles = [];
    this.primaryMemberForm.patchValue({
      pm_flattype: data.ft_id,
    });
    this.primaryMemberForm.patchValue(dataObj);
    // this.primaryMemberForm.patchValue({
    //   pm_image: dataObj.doc_filepath
    // });
    console.log(this.primaryMemberForm.value);
    this.tabView = true;
    this.openForm();
    this.initForm();
  }

  imageUpload(event) {
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
    this.primaryMemberForm.controls['pm_image'].setValue('');
  }


  startDateModal() {
    this.startpicker.open();
  }
  dobModal() {
    this.dobpicker.open();
  }

  openVehicleForm(data?) {
    const vehicleData = data;
    const vehicleDialogRef = this.dialog.open(VehicleComponent, {
      height: '80%',
      panelClass: 'full-width-dialog',
      data: vehicleData ? vehicleData : null,
      disableClose: true
    });
    vehicleDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  emitSelectedStaff(data) {
    this.openStaffForm(data);
  }

  openStaffForm(data?) {
    const staffData = data;
    const staffDialogRef = this.dialog.open(StaffComponent, {
      height: '80%',                     // changes 21/02/19
      panelClass: 'full-width-dialog',  // changes 21/02/19
      data: staffData ? staffData : null,
      disableClose: true
    });
    staffDialogRef.afterClosed().subscribe(res => {
      if (res.refresh) {
        res.is_delete ? this.datatable.refreshData(res.is_delete) : this.datatable.refreshData();
      }
    });
  }

  emitSelectedvehicle(data) {
    this.openVehicleForm(data);
  }

  openCommunicationPreferencesForm(data?) {
    const gateData = data;
    const gateDialogRef = this.dialog.open(CommunicationPreferencesComponent, {
      height: '80%',                     // changes 21/02/19
      panelClass: 'full-width-dialog',  // changes 21/02/19
      data: gateData ? gateData : null
    });

    gateDialogRef.afterClosed().subscribe(res => {
    });
  }

  initForm() {
    this.communicationPreferencesForm = this.fb.group({
      sg_socid: [this.appState.societyId],
      sg_id: [this.appState.societyId],
      sg_name: [],
      sg_desc: [],
      sg_isactive: [],
      created_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      created_by: ['Admin'],
      update_dt: [moment(this.api.currentDate).format('DD/MM/YYYY')],
      update_by: ['']
    });
  }

  emitSelectedCommunicationPreferences(data) {
    this.openCommunicationPreferencesForm(data);
  }
}
