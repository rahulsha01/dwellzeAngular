import { Component, OnInit } from '@angular/core';
import * as fromShared from '../../../shared';
import { MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { UtilityService } from '../../../shared';

@Component({
  selector: 'dwlz-event-report',
  templateUrl: './event-report.component.html',
})
export class EventReportComponent implements OnInit {
  eventConf = this.configuration.tableConf.event;
  dataSourceFn = this.api.allEvent.bind(this.api);
  // dataSourceFn = this.api.allEventParticipation.bind(this.api);
  eventDataTransform = [{
    ev_isactive: {
      Y: 'Active',
      N: 'Inactive'
    }
  },
  ];
  // filterData;
  // open = true;
  searchForm: FormGroup;

  constructor(
    private configuration: fromShared.ConfigurationService,
    private dataTransform: fromShared.UtilityService,
    private api: fromShared.ApiService,
    private snackBar: fromShared.PopupsService,
    private appState: fromShared.AppState,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private utilityService: UtilityService

  ) { }

  ngOnInit() {
  }

  formInit() {
    this.searchForm = this.fb.group({
      ev_name: ['', [Validators.required, Validators.pattern]],
    });
  }
  // openFilterModal(): void {
  //   if (this.open) {
  //     const dialogRef = this.dialog.open(fromShared.ServiceFilterDialogComponent, {
  //       width: '50%',
  //       height: '30%',
  //       data: [{
  //         formControlName: 'ev_name',
  //         val: this.filterData ? this.filterData.ev_name : '',
  //         type: 'text',
  //         placeholder: 'Name'
  //       }
  //       ],
  //       panelClass: 'custom-modalbox',
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log(result);
  //       this.filterData = result;
  //       this.open = true;
  //     });
  //     this.open = false;
  //   }
  // }

}
