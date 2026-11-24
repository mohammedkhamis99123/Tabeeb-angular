import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { TabeebProfileComponent } from './tabeeb-profile/tabeeb-profile.component';
import { ClinicProfileComponent } from './clinic-profile/clinic-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReservationsComponent } from './reservations/reservations.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [TabeebProfileComponent,ClinicProfileComponent,ReservationsComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    TranslateModule
  ]
})
export class ProfileModule { }
