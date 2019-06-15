import { Injectable } from '@angular/core';
import { Table, Column } from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor() { }


  // Unit type Column
  flatTypeColumns: Column[] = [
    {
      displayValue: 'Unit Type',
      sortValue: 'ft_type',
      width: 33,
      search: true
    },
    {
      displayValue: 'Area (Sq Ft)',
      sortValue: 'ft_sqft',
      width: 33,
      search: true
    },
    {
      displayValue: 'Flat Numbers',
      sortValue: 'ft_numbers',
      width: 33,
      search: true
    },
  ];

  // billingChargesColumns
  billingChargesColumns: Column[] = [
    {
      displayValue: 'Billing Head',
      sortValue: 'BillingHead',
      width: 13,
      search: true
    },
    {
      displayValue: 'Type',
      sortValue: 'chr_calc',
      width: 13,
      search: true
    },
    {
      displayValue: 'Fixed Amount',
      sortValue: 'chr_fixedamt',
      width: 13,
      search: true
    },
    {
      displayValue: 'Computed 1',
      sortValue: 'compute_on',
      width: 13,
      search: true
    },
    {
      displayValue: 'Computed 2',
      sortValue: 'chr_comp2',
      width: 13,
      search: true
    },
  ];

  flatTypeTable: Table = {
    columns: this.flatTypeColumns
  };
  // Unit type Column End

  billingChargesTable: Table = {
    columns: this.billingChargesColumns
  };
  // billingChargesColumns
  billingRulesColumns: Column[] = [
    {
      displayValue: 'Billing Freq',
      sortValue: 'so_billingfreq',
      width: 13,
      search: true
    },
    {
      displayValue: 'Interest Rate PA',
      sortValue: 'so_intperc',
      width: 13,
      search: true
    },
    {
      displayValue: 'Interest method',
      sortValue: 'so_intmethod',
      width: 13,
      search: true
    },
    {
      displayValue: 'Due Days',
      sortValue: 'so_duedays',
      width: 13,
      search: true
    },
  ];

  // Start of Primary Column
  primaryMemberColumns: Column[] = [
    {
      displayValue: 'First Name',
      sortValue: 'pm_firstname',
      width: 20,
      search: true
    },
    {
      displayValue: 'Last Name',
      sortValue: 'pm_lastname',
      width: 20,
      search: true
    },
    {
      displayValue: 'FLat Type',
      sortValue: 'ft_type',
      width: 20,
      search: false
    },
    {
      displayValue: 'Profession',
      sortValue: 'pm_profession',
      width: 20,
      search: false
    },
    {
      displayValue: 'Mobile Number',
      sortValue: 'pm_mobile',
      width: 20,
      search: false
    },
    {
      displayValue: 'Intercom Number',
      sortValue: 'pm_intercom',
      width: 20,
      search: false
    },
  ];

  primaryMemberTable: Table = {
    columns: this.primaryMemberColumns
  };
  // End Primary Member

  billingRulesTable: Table = {
    columns: this.billingRulesColumns
  };
  // Start of Helpline
  helplineColumns: Column[] = [
    {
      displayValue: 'Type',
      sortValue: 'lov_displayvalue',
      width: 25,
      search: true
    },
    {
      displayValue: 'Description',
      sortValue: 'hp_desc',
      width: 25,
      search: false
    },
    {
      displayValue: 'Primary Contact',
      sortValue: 'hp_number1',
      width: 25,
      search: true
    },
    {
      displayValue: 'Secondary Contact',
      sortValue: 'hp_number2',
      width: 25,
      search: false
    }
  ];

  helplineTable: Table = {
    columns: this.helplineColumns
  };
  // End od Helpline

  // Start of Society Staff
  societyStaffColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'ss_name',
      width: 20,
      search: true
    },
    {
      displayValue: 'Category',
      sortValue: 'lov_displayvalue',
      width: 20,
      search: false
    },
    {
      displayValue: 'Working Days',
      sortValue: 'ss_weeklyoff',
      width: 20,
      search: false
    },
    {
      displayValue: 'Shift Start Time',  // changes Column Added 08/05/2019
      sortValue: 'ss_starttime',
      width: 10,
      search: true
    },
    {
      displayValue: 'Shift End Time',   // changes Column Added 08/05/2019
      sortValue: 'ss_endtime',
      width: 10,
      search: true
    },
  ];

  societyStaffTable: Table = {
    columns: this.societyStaffColumns
  };

  // End of Society Staff

  // Start of Society Committee
  societyCommitteeColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'pm_firstname',
      width: 16.6,
      search: true
    },
    {
      displayValue: 'Role',
      sortValue: 'lov_displayvalue',
      width: 16.6,
      search: true
    },
    {
      displayValue: 'Assign Date',
      sortValue: 'comm_assigneddate',
      width: 16.6,
      search: false
    },
    {
      displayValue: 'From Date',
      sortValue: 'comm_fromdate',
      width: 16.6,
      search: false
    },
    {
      displayValue: 'To Date',
      sortValue: 'comm_todate',
      width: 16.6,
      search: false
    },
    {
      displayValue: 'Status',
      sortValue: 'comm_isactive',
      width: 16.6,
      search: false
    }
  ];

  societyCommitteeTable: Table = {
    columns: this.societyCommitteeColumns
  };
  // End of Society Committee
  // Start of MtgSchedule
  mtgScheduleColumns: Column[] = [
    {
      displayValue: 'Title',
      sortValue: 'mtgs_title',
      width: 20,
      search: true
    },
    {
      displayValue: 'Initiated By',
      sortValue: 'init_by',
      width: 10,
      search: false
    },
    {
      displayValue: 'Venue',
      sortValue: 'mtgs_venue',
      width: 10,
      search: false
    },
    {
      displayValue: 'Date',
      sortValue: 'mtgs_date',
      width: 10,
      search: false
    },
    {
      displayValue: 'From',
      sortValue: 'mtgs_starttime',
      width: 10.,
      search: false
    },
    {
      displayValue: 'To',
      sortValue: 'mtgs_endtime',
      width: 10,
      search: false
    },
    {
      displayValue: 'Status',
      sortValue: 'status',
      width: 10,
      search: false
    }

  ];

  mtgScheduleTable: Table = {
    columns: this.mtgScheduleColumns
  };
  // End of MtgSchedule


  wingsColumns: Column[] = [
    {
      displayValue: 'Wing Name',
      sortValue: 'sw_name',
      width: 25,
      search: true
    },
    {
      displayValue: 'Floor',
      sortValue: 'sw_floors',
      width: 25,
      search: true
    },
    {
      displayValue: 'Flats / Floor',
      sortValue: 'sw_flatsperfloor',
      width: 25,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'sw_isactive',
      width: 25,
      search: true
    },
  ];

  wingsTable: Table = {
    columns: this.wingsColumns
  };
  // End of Wings

  // Start of Event
  eventColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'ev_name',
      width: 20,
      search: true
    },
    {
      displayValue: 'Start Date',
      sortValue: 'ev_startdate',
      width: 10,
      search: false
    },
    {
      displayValue: 'End Date',
      sortValue: 'ev_enddate',
      width: 10,
      search: false
    },
    {
      displayValue: 'Start Time',
      sortValue: 'ev_starttime',
      width: 10,
      search: false
    },
    {
      displayValue: 'End Time',
      sortValue: 'ev_endtime',
      width: 10,
      search: false
    },
    {
      displayValue: 'Status',
      sortValue: 'ev_isactive',
      width: 10,
      search: true
    },
  ];

  eventTable: Table = {
    columns: this.eventColumns
  };
  // End of Events
  amenityColumns: Column[] = [
    {
      displayValue: 'Aminity Name',
      sortValue: 'amty_name',
      width: 20,
      search: true
    },
    {
      displayValue: 'Booking Required',
      sortValue: 'amty_isbookreq',
      width: 20,
      search: true
    },
    {
      displayValue: 'Start Time',
      sortValue: 'amty_optstart',
      width: 20,
      search: true
    },
    {
      displayValue: 'End Time',
      sortValue: 'amty_optend',
      width: 20,
      search: true
    },
  ];

  assetsColumns: Column[] = [
    {
      displayValue: 'Assets Name',
      sortValue: 'sas_name',
      width: 20,
      search: true
    },
    {
      displayValue: 'AMC Supplier',
      sortValue: 'sas_supplier',
      width: 20,
      search: true
    },
    {
      displayValue: 'AMC Cost',
      sortValue: 'sas_value',
      width: 20,
      search: true
    },
    {
      displayValue: 'Last AMC Date',
      sortValue: 'sas_amcdate',
      width: 20,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'sas_isactive',
      width: 20,
      search: true
    },
  ];

  gateColumns: Column[] = [
    {
      displayValue: 'Gate',
      sortValue: 'sg_name',
      width: 33,
      search: true
    },
    {
      displayValue: 'Description',
      sortValue: 'sg_desc',
      width: 33,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'sg_isactive',
      width: 33,
      search: true
    }
  ];

  amenityTable: Table = {
    columns: this.amenityColumns
  };

  assetsTable: Table = {
    columns: this.assetsColumns
  };

  gateTable: Table = {
    columns: this.gateColumns
  };

  // start of Family table

  familyColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'mf_firstname',
      width: 33,
      search: true
    },
    {
      displayValue: 'Last Name',
      sortValue: 'mf_lastname',
      width: 33,
      search: true
    },
    {
      displayValue: 'Profession',
      sortValue: 'mf_profession',
      width: 33,
      search: true
    },
    {
      displayValue: 'Relation',
      sortValue: 'lov_displayvalue',
      width: 33,
      search: true
    },
    {
      displayValue: 'Mobile Number',
      sortValue: 'mf_mobile',
      width: 33,
      search: true
    }
  ];

  vehicleColumns: Column[] = [
    {
      displayValue: 'Vehicle Type',
      sortValue: 'mv_cat',
      width: 20,
      search: true
    },
    {
      displayValue: 'Vehicle Brand',
      sortValue: 'mv_brand',
      width: 20,
      search: true
    },
    {
      displayValue: 'Vehicle Number',
      sortValue: 'mv_no',
      width: 20,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'mv_isactive',
      width: 20,
      search: true
    },

  ];

  staffColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'sv_name',
      width: 33,
      search: true
    },
    {
      displayValue: 'Gender',
      sortValue: 'sv_gender',
      width: 33,
      search: true
    },
    {
      displayValue: 'Mobile Number',
      sortValue: 'sv_mobileno',
      width: 33,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'ms_active',
      width: 33,
      search: true
    },
  ];

  commPrefColumns: Column[] = [
    {
      displayValue: 'Name',
      sortValue: 'mc_name',
      width: 33,
      search: true
    }
  ];

  complainColumns: Column[] = [
    {
      displayValue: 'Title',
      sortValue: 'comp_title',
      width: 20,
      search: true
    },
    {
      displayValue: 'Description',
      sortValue: 'comp_desc',
      width: 20,
      search: true
    },
    {
      displayValue: 'Status',
      sortValue: 'comp_status',
      width: 20,
      search: true
    },
    {
      displayValue: 'Category',
      sortValue: 'lov_displayvalue',
      width: 20,
      search: true
    },
    {
      displayValue: 'Urgent',
      sortValue: 'comp_isurgent',
      width: 20,
      search: true
    },
  ];

  serviceColumns: Column[] = [
    {
      displayValue: 'Service Name',
      sortValue: 'srv_name',
      width: 20,
      search: true
    },
    {
      displayValue: 'Service Description',
      sortValue: 'srv_description',
      width: 20,
      search: true
    }
  ];
  vendorColumn: Column[] = [
    {
      displayValue: 'Vendor Name',
      sortValue: 'vnd_name',
      width: 20,
      search: true,
    },
    {
      displayValue: 'Vendor Qualification',
      sortValue: 'vnd_qualification',
      width: 20,
      search: true,
    },
    // {
    //   displayValue: 'Locality',
    //   sortValue: 'vnd_city',
    //   width: 20,
    //   search: true,
    // },
    {
      displayValue: 'Primary Business',
      sortValue: 'vnd_primbusiness',
      width: 20,
      search: true,
    }
  ];
  // 16/04/2019
  openRequest: Column[] = [
    {
      displayValue: 'Primary Member',
      sortValue: 'name',
      search: false,
      width: 20
    },
    {
      displayValue: 'Request Name',
      sortValue: 'rr_date',
      search: false,
      width: 20
    },
    {
      displayValue: 'Request Name',
      sortValue: 'lov_displayvalue',
      search: false,
      width: 20
    },
    {
      displayValue: 'Amount Paid',
      sortValue: 'rr_paid',
      search: false,
      width: 20
    },
    {
      displayValue: 'Amount Payable',
      sortValue: 'rr_amount',
      search: false,
      width: 20
    },
    {
      displayValue: 'Status',
      sortValue: 'rr_status',
      search: false,
      width: 20
    }
  ];

  closedRequest: Column[] = [
    {
      displayValue: 'Primary Member',
      sortValue: 'pm_firstname'.concat('pm_lastname'),
      search: false,
      width: 20
    },
    {
      displayValue: 'Request Name',
      sortValue: 'lov_displayvalue',
      search: false,
      width: 20
    },
    {
      displayValue: 'Amount Paid',
      sortValue: 'rr_paid',
      search: false,
      width: 20
    },
    {
      displayValue: 'Status',
      sortValue: 'rr_status',
      search: false,
      width: 20
    }
  ];

  noticeBoardColumns: Column[] = [
    {
      displayValue: 'Title',
      sortValue: 'nb_title',
      width: 33,
      search: true
    },
    {
      displayValue: 'Reference Number',
      sortValue: 'nb_refno',
      width: 33,
      search: true
    },
    {
      displayValue: 'Publish Date',
      sortValue: 'nb_publishdate',
      width: 33,
      search: true
    },
  ];

  albumColumn: Column[] = [
    {
      displayValue: 'Album Name',
      sortValue: 'alb_name',
      width: 50,
      search: false
    },
    {
      displayValue: 'Album Date',
      sortValue: 'alb_date',
      width: 50,
      search: false
    }
  ];
  eventReportColumns: Column[] = [
    {
      displayValue: 'Member name',
      sortValue: 'pm_firstname'.concat('pm_lastname'),
      search: false,
      width: 20
    },
    {
      displayValue: 'Wing/Flat No',
      sortValue: 'pm_firstname'.concat('pm_lastname'),
      search: false,
      width: 20
    },
    {
      displayValue: 'No Of Participants',
      sortValue: 'ep_totalmemberpartcipating'.concat('ep_totalmemberpartcipating'),
      search: false,
      width: 20
    },
    {
      displayValue: 'Payment Method',
      sortValue: 'ev_pymttype'.concat('ev_pymttype'),
      search: false,
      width: 20
    },
    {
      displayValue: 'Amount Paid',
      sortValue: 'ep_paymentamount'.concat('ep_paymentamount'),
      search: false,
      width: 20
    },
  ];


  familyTable: Table = {
    columns: this.familyColumns
  };

  vehicleTable: Table = {
    columns: this.vehicleColumns
  };

  staffTable: Table = {
    columns: this.staffColumns
  };

  commPrefTable: Table = {
    columns: this.commPrefColumns
  };

  complainTable: Table = {
    columns: this.complainColumns
  };

  serviceTable: Table = {
    columns: this.serviceColumns
  };

  vendorTable: Table = {
    columns: this.vendorColumn
  };

  openReqTable: Table = {
    columns: this.openRequest
  };

  closedReqTable: Table = {
    columns: this.closedRequest
  };

  noticeBoardTable: Table = {
    columns: this.noticeBoardColumns
  };

  albumTable: Table = {
    columns: this.albumColumn
  };
  eventReportTable = {
    columns: this.eventReportColumns
  };
  tableConf = {
    flatType: this.flatTypeTable,
    billingChargesType: this.billingChargesTable,
    billingRulesType: this.billingRulesTable,
    primaryMember: this.primaryMemberTable,
    helpline: this.helplineTable,
    societyStaff: this.societyStaffTable,
    societyCommittee: this.societyCommitteeTable,
    meetingSchedule: this.mtgScheduleTable,
    wings: this.wingsTable,
    event: this.eventTable,
    eventReport: this.eventReportTable,
    amenity: this.amenityTable,
    assets: this.assetsTable,
    gate: this.gateTable,
    //
    family: this.familyTable,
    vehicle: this.vehicleTable,
    staff: this.staffTable,
    coomunicationPreferrences: this.commPrefTable,
    //
    complain: this.complainTable,
    service: this.serviceTable,
    vendor: this.vendorTable,
    openRequest: this.openReqTable,
    closedRequest: this.closedReqTable,
    noticeBoard: this.noticeBoardTable,
    album: this.albumTable
  };
}
