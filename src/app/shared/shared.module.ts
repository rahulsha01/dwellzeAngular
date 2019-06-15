import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheetModule,
  MatSnackBarModule,
  MatTableModule,
  MatSliderModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatRippleModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatInputModule,
  MatListModule,
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatDatepickerModule,
  DateAdapter,
  MatNativeDateModule,
  MatTabsModule,
  MatIconModule,
  MatRadioModule,
  MatMenuModule,
} from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateFormat } from './components/dateformat/dateFormat';

import { ApiService } from './services/api.service';

import { DataTableComponent } from './components/datatable/datatable.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import { InitCapitalDirective } from './directives/init-capital.directive';
import { MobileNumberDirective } from './directives/mobile-no.directive';
import { ServiceFilterDialogComponent } from './components/service-filter-dialog/service-filter-dialog.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRippleModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    MatSliderModule,
    MatListModule,
    MatMenuModule
  ],
  exports: [
    HttpClientModule,
    DataTableComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    MatSliderModule,
    InitCapitalDirective,
    MatListModule,
    MatMenuModule,
    MobileNumberDirective,

  ],
  declarations: [DataTableComponent, FilterDialogComponent, MatConfirmDialogComponent, InitCapitalDirective,
    MobileNumberDirective, ServiceFilterDialogComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true }, { provide: DateAdapter, useClass: DateFormat }],
  entryComponents: [MatConfirmDialogComponent, ServiceFilterDialogComponent]
})
export class SharedModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }
}
