import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SelectClinicComponent } from './select-clinic/select-clinic.component';

const routes: Routes = [

  {path:"",redirectTo:"Login",pathMatch:"full"},
  {path:"Login",component:LoginComponent},
  {path:"SelectClinic",component:SelectClinicComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
