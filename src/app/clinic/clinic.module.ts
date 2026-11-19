import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RowActionsMenuComponent } from '../common/layouts/row-actions-menu/row-actions-menu.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OffersComponent } from './offers/offers.component';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { EmployeesComponent } from './employees/employees.component';
import { CustomersComponent } from './customers/customers.component';
import { RolePermissionsComponent } from './role-permission/role-permission.component';
import { myClinicComponent } from './my-clinic/my-clinic.component';


@NgModule({
  declarations: [ClinicDoctorsComponent
    ,OffersComponent
    ,EmployeesComponent
    ,CustomersComponent
    ,RolePermissionsComponent,
    myClinicComponent],
  imports: [
    CommonModule,
    ClinicRoutingModule,
    TranslateModule,
    NgxCustomModalComponent,
    FormsModule,
    ReactiveFormsModule,
    RowActionsMenuComponent,
    NgSelectModule,
    DataTableModule
]
})
export class ClinicModule { }
