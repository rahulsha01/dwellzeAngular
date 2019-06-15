import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateComplaintsComponent } from './create-complaints/create-complaints.component';
import { ResponseComponent } from './response/response.component';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { ComplaintsComponent } from './complaints.component';


@NgModule({
  imports: [SharedModule, ComplaintsRoutingModule],
  exports: [],
  declarations: [
    ComplaintsComponent,
    CreateComplaintsComponent,
    ResponseComponent
  ],
  providers: [],
  entryComponents: []
})
export class ComplaintsModule { }
