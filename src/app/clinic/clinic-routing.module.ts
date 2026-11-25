import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { OffersComponent } from './offers/offers.component';
import { EmployeesComponent } from './employees/employees.component';
import { CustomersComponent } from './customers/customers.component';
import { RolePermissionsComponent } from './role-permission/role-permission.component';
import { myClinicComponent } from './my-clinic/my-clinic.component';
import { ClinicDashboardComponent } from './index/index.component';

const routes: Routes = [
{
  path:"",
  redirectTo:"Index",
  pathMatch:'full'
},
{
  path:"Index",
  component:ClinicDashboardComponent,
  canActivate: [roleGuard],
    data: { roles: ['Admin'] }
},
  {
    path:"Doctors",
    component:ClinicDoctorsComponent,
    
  },
  {
    path:"Offers",
    component:OffersComponent
  },
  {
    path:"Employees",
    component:EmployeesComponent
  },
  {
    path:"Customers",
    component:CustomersComponent
  },
  {
    path:"Permissions",
    component:RolePermissionsComponent
  },
  {
    path:"MyClinic",
    component:myClinicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
