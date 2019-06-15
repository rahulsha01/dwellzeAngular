import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportRoutingModule } from './reports-routing.module';
import { StaffReportComponent } from './staff-report/staff-report.component';
import { EventReportComponent } from './event-report/event-report.component';
import { DueReportComponent } from './due-report/due-report.component';
import { VisitorReportComponent } from './visitor-report/visitor-report.component';
import { ComplaintsReportComponent } from './complaints-report/complaints-report.component';
import { AmenityReportComponent } from './amenity-report/amenity-report.component';
import { ReportComponent } from './reports.component';


@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  exports: [],
  declarations: [
    ReportComponent,
    StaffReportComponent,
    EventReportComponent,
    DueReportComponent,
    VisitorReportComponent,
    ComplaintsReportComponent,
    AmenityReportComponent
  ],
  providers: [],
})
export class ReportModule { }
