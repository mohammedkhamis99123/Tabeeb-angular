import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SelectClinicComponent } from './select-clinic/select-clinic.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { SignupComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [

  {path:"",redirectTo:"Login",pathMatch:"full"},
  {path:"Login",component:LoginComponent},
  {path:"SelectClinic",component:SelectClinicComponent},
  {path:"unauthorized",component:UnAuthorizedComponent},
  {path:"SignUp",component:SignupComponent},
  {path:"ForgetPassword",component:ForgotPasswordComponent},
  {path:"ResetPassword",component:ResetPasswordComponent},
  {path:"SignUp",component:SignupComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
