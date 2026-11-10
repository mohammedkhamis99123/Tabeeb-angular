import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { AppLayout } from './Common/layouts/app-layout';

// dashboard

export const routes: Routes = [
    {
        path: '',
        loadChildren:()=> import("../app/auth/auth.module").then(m=>m.AuthModule)
      
    },

    {
        path:'SuperAdmin',
        component:AppLayout,
        loadChildren:()=>import("../app/super-admin/super-admin.module").then(s=>s.SuperAdminModule)
    },
    {
        path:'Profile',
        loadChildren:()=>import("../app/profile/profile.module").then(a=>a.ProfileModule)
    },
    {
        path:"Clinic",
         component:AppLayout,
        loadChildren:()=>import("../app/clinic/clinic.module").then(a=>a.ClinicModule)
    }


];
