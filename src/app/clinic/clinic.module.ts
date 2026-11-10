import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicDoctorsComponent } from './doctors/doctors.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RowActionsMenuComponent } from '../Common/layouts/row-actions-menu/row-actions-menu.component';


@NgModule({
  declarations: [ClinicDoctorsComponent],
  imports: [
    CommonModule,
    ClinicRoutingModule,
    TranslateModule,
    NgxCustomModalComponent,
    FormsModule,
    ReactiveFormsModule,
    RowActionsMenuComponent
]
})
export class ClinicModule { }
