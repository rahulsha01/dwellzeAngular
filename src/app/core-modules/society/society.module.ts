import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SocietyRoutingModule } from './society-routing.module';

import { SocietyComponent } from './society.component';
import { SocietyCommitteeComponent } from './society-committee/society-committee.component';
import { FilterDialogComponent } from '../../shared';
import { SocietyDetailsComponent } from './society-details/society-details.component';
import { WingsComponent } from './society-details/wings/wings.component';
import { AmenitiesComponent } from './society-details/amenities/amenities.component';
import { GatesComponent } from './society-details/gates/gates.component';
import { AssetsComponent } from './society-details/assets/assets.component';
import { SocietyStaffComponent } from './society-staff/society-staff.component';


@NgModule({
  imports: [
    SharedModule,
    SocietyRoutingModule
  ],
  exports: [],
  declarations: [
    SocietyComponent,
    SocietyCommitteeComponent,
    SocietyDetailsComponent,
    SocietyStaffComponent,
    WingsComponent,
    AmenitiesComponent,
    GatesComponent,
    AssetsComponent,
  ],
  providers: [],
  entryComponents: [
    FilterDialogComponent,
    WingsComponent,
    AmenitiesComponent,
    GatesComponent,
    AssetsComponent,
  ]
})
export class SocietyModule { }
