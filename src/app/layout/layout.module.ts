import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwlzLayoutComponent } from './components/dwlz-layout.component';
import { DwlzToolbarComponent } from './components/dwlz-toolbar.component';
import { DwlzSideNavComponent } from './components/dwlz-sidenav.component';
import { DwlzContentComponent } from './components/dwlz-content.component';
import { DwlzFooterComponent } from './components/dwlz-footer.component';


@NgModule({
  declarations: [
    DwlzLayoutComponent,
    DwlzSideNavComponent,
    DwlzToolbarComponent,
    DwlzContentComponent,
    DwlzFooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DwlzLayoutComponent,
    DwlzSideNavComponent,
    DwlzToolbarComponent,
    DwlzContentComponent,
    DwlzFooterComponent
  ]
})
export class LayoutModule { }
