import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryMemberComponent } from './primary-member/primary-member.component';
import { PrimaryMasterComponent } from './primaryMaster.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: PrimaryMasterComponent,
    data: {
      breadcrumb: 'members'
    },
    children: [
      {
        path: '',
        redirectTo: 'primary-member',
        pathMatch: 'full',
        // component: PrimaryMemberComponent
      },
      {
        path: 'primary-member',
        component: PrimaryMemberComponent,
        data: {
          breadcrumb: 'Primary Member'
        }
      },
      {
        path: 'upload',
        component: UploadComponent,
        data: {
          breadcrumb: 'Upload'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrimaryMemberRoutingModule { }
