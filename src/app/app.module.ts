import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
// import { MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { SharedModule } from './shared/shared.module';
import { MasterModule } from './core-modules/master/master.module';
import { ErrorService } from './shared/services/error-handler.service';
import { LoginModule } from './authentication/login/login.module';

import { LoginAuthGuard } from './authentication/guard/login-auth.guard';
// import { MasterModule } from './core-modules/master/master.module';
// import { CdkTableModule } from '@angular/cdk/table';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { AuthGuard } from './authentication/guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    // MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MasterModule,
    LoginModule,
    MatMenuModule

  ],
  providers: [AuthGuard, LoginAuthGuard, { provide: ErrorHandler, useClass: ErrorService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
