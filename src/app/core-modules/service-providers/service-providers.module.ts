import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors/vendors.component';

import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ServiceProvidersComponent } from './service-providers.component';
import { ServiceProvidersRoutingModule } from './service-providers-routing.module';

@NgModule({
    imports:[
        SharedModule,
        ServiceProvidersRoutingModule,
        CommonModule
    ],
    declarations:[
        ServiceProvidersComponent,
        VendorsComponent,
    ],
    exports:[],
    providers:[]
})
export class ServiceProvidersModule{
}