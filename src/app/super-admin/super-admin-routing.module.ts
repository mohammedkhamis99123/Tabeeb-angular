import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboardComponent  } from './super-admin-index/super-admin-index.component';
import { SpecializationComponent } from './specialization/specialization.component';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { SubscriptionPackageComponent } from './supscription-package/supscription-package.component';
import { ClinicComponent } from './clinic/clinic.component';
import { SubscriptionComponent } from './subscriptions/subscriptions.component';
import { authGuard } from '../common/guards/auth.guard';

const routes: Routes = [

  {
    path:'',
    redirectTo:"Index",
    pathMatch:'full',
   
  },
  {
  path:'Specialization',
  component:SpecializationComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
  {
    path:'Country',
    component:CountryComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
    {
    path:'City',
    component:CityComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
  
    {
    path:'Clinic',
    component:ClinicComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
   {
    path:'SubscriptionPackage',
    component:SubscriptionPackageComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
  {
    path:"Index",
    component:SuperAdminDashboardComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  },
  {
    path:"Subscription",
    component:SubscriptionComponent,
      canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
