import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './vendors/vendors.component';
import { ServiceProvidersComponent } from './service-providers.component';

const routes: Routes = [
    {
        path: '',
        component: ServiceProvidersComponent,
        data: {
            breadcrumb: 'service-providers'
        },
        children: [
            {
                path: '',
                redirectTo: 'vendors',
                pathMatch: 'full'
            },
            {
                path: 'vendors',
                component: VendorsComponent,
                data: {
                    breadcrumb: 'vendors'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ServiceProvidersRoutingModule {

}
