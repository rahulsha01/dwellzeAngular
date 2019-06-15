import { NgModule } from '@angular/core';
import { UnitTypeComponent } from './unit-type/unit-type.component';
import { MasterComponent } from './master.component';
import { SharedModule } from '../../shared/shared.module';
import { MasterRoutingModule } from './master-routing.module';
import { FilterDialogComponent } from '../../shared/components/filter-dialog/filter-dialog.component';
import { HelplineComponent } from './helpline/helpline.component';
import { RequestTypeComponent } from './request-type/request-type.component';

@NgModule({
  imports: [SharedModule, MasterRoutingModule],
  exports: [],
  declarations: [
    MasterComponent,
    UnitTypeComponent,
    HelplineComponent,
    RequestTypeComponent
  ],
  providers: [],
  entryComponents: [FilterDialogComponent,
  ]
})
export class MasterModule { }
