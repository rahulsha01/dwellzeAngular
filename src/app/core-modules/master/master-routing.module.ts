import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitTypeComponent } from './unit-type/unit-type.component';
import { MasterComponent } from './master.component';
import { HelplineComponent } from './helpline/helpline.component';
import { RequestTypeComponent } from './request-type/request-type.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    data: {
      breadcrumb: 'master'
    },
    children: [
      {
        path: '',
        redirectTo: 'unit-type',
        pathMatch: 'full'
      },
      {
        path: 'unit-type',
        component: UnitTypeComponent,
        data: {
          breadcrumb: 'unit type'
        }
      },
      {
        path: 'request-type',
        component: RequestTypeComponent,
        data: {
          breadcrumb: 'request type'
        }
      },
      {
        path: 'helpline',
        component: HelplineComponent,
        data: {
          breadcrumb: 'Helpline'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
