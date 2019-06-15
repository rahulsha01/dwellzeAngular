import { NgModule } from '@angular/core';
import { LoginContainerComponent } from './container/login-container.component';
import { LoginFormComponent } from './component/login-form.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginContainerComponent,
    LoginFormComponent,
  ],
  imports: [
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LoginModule { }
