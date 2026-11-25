import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicProfileComponent } from './clinic-profile/clinic-profile.component';
import { TabeebProfileComponent } from './tabeeb-profile/tabeeb-profile.component';
import { ReservationsComponent } from './reservations/reservations.component';

const routes: Routes = [

  {
    path:"Tabeeb",
    component:TabeebProfileComponent
  },
  {path:'Clinic/:id',
    component:ClinicProfileComponent
  },
  {
    path:'Reservations',
    component:ReservationsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
