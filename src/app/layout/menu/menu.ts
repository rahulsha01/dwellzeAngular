export class Menu {
  displayName: string;
  link: string;
  icon?: string;
  children?: Array<Menu>;
}

export const MenuModel: Array<Menu> = [
  {
    displayName: 'master',
    link: 'master',
    icon: 'ballot',
    children: [
      {
        displayName: 'Unit Type',
        link: 'master/unit-type',
      },
      {
        displayName: 'Helpline Nos',
        link: 'master/helpline',
      },
      {
        displayName: 'Request Type',
        link: 'master/request-type'
      },
    ]
  },
  {
    displayName: 'Society',
    link: 'society',
    icon: 'domain',
    children: [
      {
        displayName: 'Society Details',
        link: 'society/society-details'
      },
      {
        displayName: 'Society Committee',
        link: 'society/society-committee',
      },
      {
        displayName: 'Society Staff',
        link: 'society/society-staff',
      },
    ]
  },
  {
    displayName: 'Service Providers',
    link: 'service-providers',
    icon: 'build',
    children: [
      {
        displayName: 'Vendors',
        link: 'service-providers/vendors'
      },
      // {
      //   displayName: 'Select',
      //   link: 'service-providers/select'
      // },
      {
        displayName: 'Transcation Summary',
        link: ' service-providers/transaction-summary'
      }
    ]
  },
  {
    displayName: 'Billing',
    link: 'billing',
    icon: 'attach_money',
    children: [
      {
        displayName: 'Billing Charges',
        link: 'billing/billing-charges',
      },
      {
        displayName: 'Billing Rules',
        link: 'billing/billing-rules'
      },
      {
        displayName: 'Generate Bills',
        link: 'billing/generate-bills',
      },
      {
        displayName: 'View Bills',
        link: 'billing/view-bills',
      },
      {
        displayName: 'Payments',
        link: 'billing/payments',
      }
    ]
  },
  {
    displayName: 'Members',
    link: 'members',
    icon: 'domain',
    children: [
      {
        displayName: 'Create / Edit',
        link: 'members/primary-member',
      },
      {
        displayName: 'Upload',
        link: 'members/upload'
      }
    ]
  },
  {
    displayName: 'Communication',
    link: 'communication',
    icon: 'forum',
    children: [
      {
        displayName: 'Meetings',
        link: 'communication/meeting-schedule'
      },
      {
        displayName: 'Events',
        link: 'communication/event'
      },

      {
        displayName: 'BroadCast Message',
        link: 'communication/broadcast-message',
      },
      {
        displayName: 'Album',
        link: 'communication/album',
      },
      {
        displayName: 'Notices',
        link: 'communication/notice-board'
      },
      {
        displayName: 'Process Request',
        link: 'communication/process-request'
      }
    ]
  },
  {
    displayName: 'Complaints',
    link: 'complaints',
    icon: 'report',
    children: [
      {
        displayName: 'Create Complaints',
        link: 'complaints/create-complaints',
      },
      {
        displayName: 'Respond To Complaints',
        link: 'complaints/response',
      },
    ]
  },
  {
    displayName: 'Reports',
    link: 'report',
    icon: 'report_problem',
    children: [
      {
        displayName: 'Staff Attendance',
        link: 'report/staff-attendance',
      },
      {
        displayName: 'Event Participants',
        link: 'report/events',
      },
      {
        displayName: 'Outstanding Due Report',
        link: 'report/due'
      },
      {
        displayName: 'Visitor Report',
        link: 'report/visitor'
      },
      {
        displayName: 'Complaints Report',
        link: 'report/complaints'
      },
      {
        displayName: 'Amenity Booking Report',
        link: 'report/amenity'
      }
    ]
  },
];
