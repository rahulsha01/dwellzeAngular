import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  Optional,
  OnDestroy
} from '@angular/core';
import { Table, Column } from '../../models/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as fromShared from '../../services/api.service';
import { AppState } from '../../services/state-management.service';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialogRef
} from '@angular/material';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { UtilityService } from '../../services/utility.service';
import { DataTransferService } from '../../services';

// import { query } from '@angular/core/src/render3';

@Component({
  selector: 'dwlz-datatable',
  templateUrl: 'datatable.component.html'
})
export class DataTableComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoadingResults: boolean;
  resultsLength: any;
  dtaSource: any;
  data;
  filter: any;
  search: any;
  memId: any;
  meetingStatus: any;
  actions = true;
  serviceId: any;
  vendorId: any;
  datas: any;
  constructor(
    private el: ElementRef,
    private dataTransform: UtilityService,
    private dataTransfer: DataTransferService,
    private api: fromShared.ApiService,
    private appState: AppState,

  ) { }
  private _newFormDataChanges = new BehaviorSubject({});
  formChangesSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @Output() selected = new EventEmitter();
  @Input() configuration: Table;
  @Input() dataSource;
  @Input()
  set newFormData(value) {
    this._newFormDataChanges.next(value);
  }

  get newFormData() {
    return this._newFormDataChanges.value;
  }

  @Input() dataTransformation;
  @Input() searchable;
  dubData;
  input: any;

  displayedColumns: Array<any>;
  displayVal;
  displayStatus;

  ngOnInit() {
    this.getMemId();
    this.initialConfiguration();
    this.displayData();
    this.formChangesSubscription = this._newFormDataChanges.subscribe(e => {
      this.displayData(e);
    });
  }

  applyFilter(e: any) {
    this.searchable = true;
    this.displayData(e);
  }

  refreshData(update?) {
    console.log('sds');
    if (update && this.data.length < 2) {
      this.paginator.pageIndex = this.paginator.pageIndex - 1;
    }
    this.displayData();
  }

  clickHandler(index) {
    // console.log(this.dubData[index]);
    this.selected.emit(this.dubData[index]);
  }
  getMemId() {
    this.dataTransfer.memId.subscribe(response => {
      console.log(response);
      this.memId = response;
      //  (response);
    });
  }


  initialConfiguration() {
    this.dtaSource = this.dataSource;
    this.displayVal = this.configuration.columns;
    this.displayStatus = this.configuration.columns;
    this.displayedColumns = this.displayVal.map(x => x.sortValue);
    //  (this.filter)
    // this.input = this.paginator.pageIndex+`?search=null&&filter=${this.filter}`;
  }

  displayData(filterData?) {
    // console.log(filterData);
    //  (this.memId);
    this.getMemId();
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.datas = {
            socID: this.appState.societyId,
            pageNo: this.paginator.pageIndex + 1,
            pmID: this.memId ? this.memId : '',
            pagination: 'Y',
            searchText: '',
            column: '',
          };
          if (this.newFormData) {
            this.datas = { ...this.datas, ...this.newFormData };
          }
          const formdata = this.dataTransform.newFormDataArray(this.datas);
          this.isLoadingResults = true;

          return this.dtaSource(formdata);
        }),
        map((response: any) => {
          //  (response);
          this.isLoadingResults = false;
          //  (this.isLoadingResults);
          this.resultsLength = response.TOTAL_ROWS;
          return response;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(response => {
        // this.dubData = JSON.parse(JSON.stringify(response.DATA));
        // if (this.newFormData && this.newFormData.status === '') {
        //   this.dubData = response.DATA.filter(x => x.status !== 'Completed');
        // } else {
        //   this.dubData = JSON.parse(JSON.stringify(response.DATA));
        // }
        this.dubData = JSON.parse(JSON.stringify(response.DATA));
        if (this.dataTransformation) {
          response.DATA.map(e => {
            this.dataTransformation.forEach(f => {
              // console.log(f);
              const currentKey = Object.keys(f)[0];
              e[currentKey] = f[currentKey][e[currentKey]];
              // console.log(e);
            });
            //  (e);
            return e;
          });
        }

        // if (this.newFormData && this.newFormData.status === '') {
        //   this.data = response.DATA.filter(x => x.status !== 'Completed');

        // } else {
        this.data = response.DATA;

        // }
      });
  }
  ngAfterViewInit(): void {
    //  ('asdsad');
    // this.data.sort = this.sort;
  }

  ngOnDestroy() {
    this.data = [];
    //  ('table destroyed');
  }

}
