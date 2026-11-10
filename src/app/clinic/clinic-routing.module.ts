import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicDoctorsComponent } from './doctors/doctors.component';

const routes: Routes = [

  {
    path:"Doctors",
    component:ClinicDoctorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
