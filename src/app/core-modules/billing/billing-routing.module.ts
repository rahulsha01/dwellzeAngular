import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingChargesComponent } from './billing-charges/billing-charges.component';
import { BillingRulesComponent } from './billing-rules/billing-rules.component';
import { BillingComponent } from './billing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
    data: {
      breadcrumb: 'billing'
    },
    children: [
      {
        path: '',
        redirectTo: 'billing-charges',
        pathMatch: 'full',
      },
      {
        path: 'billing-charges',
        component: BillingChargesComponent,
        data: {
          breadcrumb: 'Billing Charges'
        }
      },
      {
        path: 'billing-rules',
        component: BillingRulesComponent,
        data: {
          breadcrumb: 'Billing Rules'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule { }
