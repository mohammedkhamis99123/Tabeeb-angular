import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { OffersComponent } from './offers/offers.component';
import { EmployeesComponent } from './employees/employees.component';
import { CustomersComponent } from './customers/customers.component';
import { RolePermissionsComponent } from './role-permission/role-permission.component';
import { myClinicComponent } from './my-clinic/my-clinic.component';
import { ClinicDashboardComponent } from './index/index.component';
import { authGuard } from '../common/guards/auth.guard';

const routes: Routes = [
{
  path:"",
  redirectTo:"Index",
  pathMatch:'full'
},
{
  path:"Index",
  component:ClinicDashboardComponent,
  canActivate: [authGuard],
    data: { roles: ['Admin'] }
},
  {
    path:"Doctors",
    component:ClinicDoctorsComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
    
  },
  {
    path:"Offers",
    component:OffersComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path:"Employees",
    component:EmployeesComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path:"Customers",
    component:CustomersComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path:"Permissions",
    component:RolePermissionsComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path:"MyClinic",
    component:myClinicComponent,
      canActivate: [authGuard],
    data: { roles: ['Admin'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
