import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './reports.component';
import { StaffReportComponent } from './staff-report/staff-report.component';
import { EventReportComponent } from './event-report/event-report.component';
import { DueReportComponent } from './due-report/due-report.component';
import { VisitorReportComponent } from './visitor-report/visitor-report.component';
import { ComplaintsReportComponent } from './complaints-report/complaints-report.component';
import { AmenityReportComponent } from './amenity-report/amenity-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    data: {
      breadcrumb: 'report'
    },
    children: [{
      path: '',
      redirectTo: 'staff-attendance',
      pathMatch: 'full'
    },
    {
      path: 'staff-attendance',
      component: StaffReportComponent,
      data: {
        breadcrumb: 'Staff Attendance'
      }
    },
    {
      path: 'events',
      component: EventReportComponent,
      data: {
        breadcrumb: 'Event Participants'
      }
    },
    {
      path: 'due',
      component: DueReportComponent,
      data: {
        breadcrumb: 'Outstanding Due Report '
      }
    },
    {
      path: 'visitor',
      component: VisitorReportComponent,
      data: {
        breadcrumb: 'Visitor Report'
      }
    },
    {
      path: 'complaints',
      component: ComplaintsReportComponent,
      data: {
        breadcrumb: 'Complaints Report'
      }
    }, {
      path: 'amenity',
      component: AmenityReportComponent,
      data: {
        breadcrumb: 'Amenity Booking Report'
      }
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
