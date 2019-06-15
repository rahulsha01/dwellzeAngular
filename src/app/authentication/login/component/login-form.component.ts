import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import * as fromShared from '../../../shared';
import { Router } from '@angular/router';
import { CryptoService } from '../../../shared';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login-form',
  templateUrl: '../template/login-form.component.html'
})

export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  userData: any;
  invalidDetails: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: fromShared.ApiService,
    private dataTransform: fromShared.UtilityService,
    private appState: fromShared.AppState,
    private storage: fromShared.StorageService,
    private crypto: CryptoService
  ) { }


  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.loginForm = this.fb.group({
      userID: ['', Validators.required],
      pwd: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const postData = {
        userID: this.loginForm.get('userID').value,
        pwd: this.loginForm.get('pwd').value
      };
      const formData = this.dataTransform.newFormDataArray(postData);
      this.api.newLogin(formData).subscribe((response: any) => {
        if (response.STATUS === 'SUCCESS') {
          this.storage.setStorage('dwellze-soc-admin', this.crypto.encrypt(response.DATA[0]));
          this.appState.isLoggedIn = true;
          this.router.navigate(['/master']);
        } else {
          this.invalidDetails = true;
        }
      });
    }
  }

  onReset() {
    this.loginForm.reset();
    this.invalidDetails = false;
  }
}
