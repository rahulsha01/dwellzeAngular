import { NgModule } from '@angular/core';
import { PrimaryMemberComponent } from './primary-member/primary-member.component';
import { SharedModule } from '../../shared/shared.module';
import { FilterDialogComponent } from '../../shared/components/filter-dialog/filter-dialog.component';
import { FamilyComponent } from './primary-member/family/family.component';
import { VehicleComponent } from './primary-member/vehicle/vehicle.component';
import { StaffComponent } from './primary-member/staff/staff.component';
import { CommunicationPreferencesComponent } from './primary-member/communicationPreferences/communicationPreferences.component';
import { PrimaryMasterComponent } from './primaryMaster.component';
import { PrimaryMemberRoutingModule } from './primaryMaster-routing.module';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  imports: [SharedModule, PrimaryMemberRoutingModule],
  exports: [],
  declarations: [
    PrimaryMasterComponent,
    PrimaryMemberComponent,
    FamilyComponent,
    VehicleComponent,
    StaffComponent,
    CommunicationPreferencesComponent,
    UploadComponent
  ],
  providers: [],
  entryComponents: [FilterDialogComponent,
    // ConfirmationDialogComponent,
    FamilyComponent,
    VehicleComponent,
    StaffComponent,
    CommunicationPreferencesComponent,
  ]
})
export class PrimaryMasterModule { }
