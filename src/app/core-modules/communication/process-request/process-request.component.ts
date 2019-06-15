import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as fromShared from '../../../shared';
@Component({
  selector: 'dwlz-process-request',
  templateUrl: './process-request.component.html'
})
export class ProcessRequestComponent implements OnInit {
  imageFiles = [];
  imgSrc;
  imgUpload = [];
  processReqForm: FormGroup;
  open: any = 'O';
  closed: any = 'C';
  isForm: boolean;
  singleOpenRequestData: any;
  disabled: boolean;
  isClosed = false;
  hideTab = document.getElementsByClassName('mat-tab-header') as HTMLCollectionOf<HTMLElement>;
  closedData: any;

  constructor(
    private fb: FormBuilder,
    private api: fromShared.ApiService,
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.DataTransferService,
  ) { }

  openRequestConfig = this.configuration.tableConf.openRequest;
  closedRequestConfig = this.configuration.tableConf.closedRequest;

  requestDataSourceFn = this.api.allProcessRaiseRequest.bind(this.api);
  metaDataOpen;
  metaDataClosed;
  ngOnInit() {
    this.getData();
  }

  initForm() {
    this.processReqForm = this.fb.group({
      proc_req: this.fb.group({
        rr_id: [],
        pm_lastname: [],
        rr_pmid: [],
        pm_firstname: [],
        lov_storevalue: [],
        rr_status: [],
        sw_name: [],
        lov_displayvalue: [],
        pm_flatno: [],
        rr_socid: [],
        rr_reqtype: [],
        rr_date: [],
        rr_paid: [],
        rr_amount: null
      }),
      request_details: this.fb.group({
        description: [],
      }),
      response_details: this.fb.group({
        proc_req_payment: this.fb.group({
          payment_method: [],
          bank_name: [],
          branch_name: [],
          txn_ref_no: [],
          amt_paid: []
        }),
        response: [],
        proc_req_attchment: [],
        proc_req_status: []
      })
    });
  }

  getData(){
    const formData = { 'status': this.open };
    this.metaDataOpen = formData;
    const frmData = { 'status': this.open };
    this.metaDataClosed = frmData;
  }

  switchTab(event) {
    if (event.index === 1) {
      this.isClosed = false;
    }
    if (event.index === 0) {
      this.isForm = false;
    }
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
  }

  radioChange($event) {
    if ($event.value === 'O') {
      this.processReqForm.patchValue({
        proc_req_status: this.open
      });
    } else {
      this.processReqForm.patchValue({
        proc_req_status: this.closed
      });
    }
  }
  handleChange($event) {
    if ($event.value === 'Net_Banking' || $event.value === 'Credit_Card' || $event.value === 'Debit_Card') {
      this.processReqForm.controls['proc_req_payment'].patchValue({
        payment_method: $event.value
      });
    }
    if ($event.value === 'Cash') {
      this.processReqForm.controls['proc_req_payment'].patchValue({
        payment_method: $event.value
      });
    }
  }
  emitSelectedRequest(data) {
    this.hideTab[0].style.display = 'none';
    this.isClosed = false;
    this.initForm();
    this.singleOpenRequestData = data;
    data.pm_flatno = (data.sw_name).concat('/' + data.pm_flatno);
    console.log(this.singleOpenRequestData.rr_amount);
    const reqDate = data.rr_date.split('/').reverse().join('-');
    data.rr_date = reqDate;
    this.processReqForm.controls['proc_req'].patchValue(data);
    this.processReqForm.controls['response_details'].patchValue({
      proc_req_status: this.singleOpenRequestData.rr_status
    });
    this.disabled = this.singleOpenRequestData.rr_paid === 'N' ? true : false;
    this.isForm = true;
  }
  Save() {
    this.isClosed = true;
    this.isForm = false;
    this.hideTab[0].style.display = 'flex';
  }
  closeForm() {
    this.isForm = false;
    this.isClosed = true;
    this.hideTab[0].style.display = 'flex';
  }
  emitSelectedClosedRequest(event) {
    const reqDate = event.rr_date.split('/').reverse().join('-');
    event.rr_date = reqDate;
    event.pm_flatno = (event.sw_name).concat('/' + event.pm_flatno);
    this.closedData = event;
    this.isClosed = true;
    this.hideTab[0].style.display = 'none';
  }
  closeClosedForm(){
    this.isClosed = false;
    this.hideTab[0].style.display = 'flex';
  }
}
