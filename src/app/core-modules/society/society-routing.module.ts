import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocietyComponent } from './society.component';
import { SocietyCommitteeComponent } from './society-committee/society-committee.component';
import { SocietyStaffComponent } from './society-staff/society-staff.component';
import { SocietyDetailsComponent } from './society-details/society-details.component';

const routes: Routes = [
  {
    path: '',
    component: SocietyComponent,
    data: {
      breadcrumb: 'society'
    },
    children: [
      {
        path: '',
        redirectTo: 'society-details',
        pathMatch: 'full'
      },
      {
        path: 'society-details',
        component: SocietyDetailsComponent,
        data: {
          breadcrumb: 'Society Details'
        }
      },
      {
        path: 'society-staff',
        component: SocietyStaffComponent,
        data: {
          breadcrumb: 'Society Staff'
        }
      },
      {
        path: 'society-committee',
        component: SocietyCommitteeComponent,
        data: {
          breadcrumb: 'Society Committee'
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocietyRoutingModule { }
