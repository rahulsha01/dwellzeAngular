import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BillingChargesComponent } from './billing-charges/billing-charges.component';
import { BillingRulesComponent } from './billing-rules/billing-rules.component';
import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './billing.component';


@NgModule({
  imports: [
    SharedModule,
    BillingRoutingModule
  ],
  exports: [],
  declarations: [
    BillingComponent,
    BillingChargesComponent,
    BillingRulesComponent
  ],
  providers: [],
  entryComponents: [ ]
})
export class BillingModule { }
