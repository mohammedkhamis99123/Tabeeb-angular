import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { IconModule } from '../Common/shared/icon/icon.module';
import { LoginComponent } from './login/login.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectClinicComponent } from './select-clinic/select-clinic.component';

@NgModule({
  declarations: [
    SelectClinicComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IconModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
