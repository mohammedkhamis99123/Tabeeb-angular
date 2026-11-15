import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [

  {
    path:"Doctors",
    component:ClinicDoctorsComponent
  },
  {
    path:"Offers",
    component:OffersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
