import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { OffersComponent } from './offers/offers.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [

  {
    path:"Doctors",
    component:ClinicDoctorsComponent
  },
  {
    path:"Offers",
    component:OffersComponent
  },
  {
    path:"Employees",
    component:EmployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
