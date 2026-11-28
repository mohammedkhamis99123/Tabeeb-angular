import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { IconModule } from '../common/shared/icon/icon.module';
import { LoginComponent } from './login/login.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectClinicComponent } from './select-clinic/select-clinic.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { ForgotPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './sign-up/sign-up.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SelectClinicComponent,
    LoginComponent,
    UnAuthorizedComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IconModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class AuthModule { }
