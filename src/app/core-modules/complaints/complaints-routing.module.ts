import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintsComponent } from './complaints.component';
import { CreateComplaintsComponent } from './create-complaints/create-complaints.component';
import { ResponseComponent } from './response/response.component';

const routes: Routes = [
  {
    path: '',
    component: ComplaintsComponent,
    data: {
      breadcrumb: 'complaints'
    },
    children: [
      {
        path: '',
        redirectTo: 'create-complaints',
        pathMatch: 'full',
      },
      {
        path: 'create-complaints',
        component: CreateComplaintsComponent,
        data: {
          breadcrumb: 'Create Complaints'
        }
      },
      {
        path: 'response',
        component: ResponseComponent,
        data: {
          breadcrumb: 'response'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintsRoutingModule { }
