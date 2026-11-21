import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminDashboardComponent } from './super-admin-index/super-admin-index.component';
import { SpecializationComponent } from './specialization/specialization.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { DataTableModule, NgDataTableComponent } from '@bhplugin/ng-datatable';
import { RowActionsMenuComponent } from '../common/layouts/row-actions-menu/row-actions-menu.component';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { SubscriptionPackageComponent } from './supscription-package/supscription-package.component';
import { ClinicComponent } from './clinic/clinic.component';
import { SubscriptionComponent } from './subscriptions/subscriptions.component';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    SpecializationComponent,
    CountryComponent,
    CityComponent,
    SubscriptionPackageComponent,
    ClinicComponent,
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    TranslateModule,
    FormsModule,
    NgxCustomModalComponent,
    ReactiveFormsModule,
    DataTableModule,
    RowActionsMenuComponent,
    NgxExtendedPdfViewerModule,
    NgApexchartsModule
    
  ]
})
export class SuperAdminModule { }
