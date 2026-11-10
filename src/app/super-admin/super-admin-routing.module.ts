import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminIndexComponent } from './super-admin-index/super-admin-index.component';
import { SpecializationComponent } from './specialization/specialization.component';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { SubscriptionPackageComponent } from './supscription-package/supscription-package.component';
import { ClinicComponent } from './clinic/clinic.component';
import { SubscriptionComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [

  {
    path:'',
    redirectTo:"Index",
    pathMatch:'full'
  },
  {
  path:'Specialization',
  component:SpecializationComponent
  },
  {
    path:'Country',
    component:CountryComponent
  },
    {
    path:'City',
    component:CityComponent
  },
  
    {
    path:'Clinic',
    component:ClinicComponent
  },
   {
    path:'SubscriptionPackage',
    component:SubscriptionPackageComponent
  },
  {
    path:"Index",
    component:SuperAdminIndexComponent
  },
  {
    path:"Subscription",
    component:SubscriptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
