import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginAuthGuard } from './authentication/guard/login-auth.guard';
import { AuthGuard } from './authentication/guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: './authentication/login/login.module#LoginModule',
    canActivate: [LoginAuthGuard]
  },
  {
    path: 'society',
    loadChildren: './core-modules/society/society.module#SocietyModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'master',
    loadChildren: './core-modules/master/master.module#MasterModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'communication',
    loadChildren: './core-modules/communication/communication.module#CommunicationModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadChildren: './core-modules/reports/reports.module#ReportModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'members',
    loadChildren: './core-modules/primaryMaster/primaryMaster.module#PrimaryMasterModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'service-providers',
    loadChildren: './core-modules/service-providers/service-providers.module#ServiceProvidersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'billing',
    loadChildren: './core-modules/billing/billing.module#BillingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'complaints',
    loadChildren: './core-modules/complaints/complaints.module#ComplaintsModule',
    canActivate: [AuthGuard]
  }
  ,
  {
    path: '**',
    redirectTo: 'master',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
