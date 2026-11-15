import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectClinicService } from './Services/select-clinic.service';

@Component({
  selector: 'app-select-clinic',
 
  templateUrl: './select-clinic.component.html',
  styleUrl: './select-clinic.component.css'
})
export class SelectClinicComponent {
clinics: any[] = [];
selectedClinicId: number | null = null;

constructor(private router:Router,
  private Service:SelectClinicService
) {


}
ngOnInit(): void {
    const data = sessionStorage.getItem('Clinics');

    if (data) {
        this.clinics = JSON.parse(data);
        console.log(this.clinics);
        
    }
}
   selectClinic(clinic: any): void {

        this.selectedClinicId = clinic;
        this.Service.SelectClinic(this.selectedClinicId!).subscribe(result=>{
          if(result.isSuccess){
            sessionStorage.setItem("Token",result.data.token)
            sessionStorage.setItem("TokenEndAt",result.data.tokenEndAt)
            sessionStorage.setItem("refreshtokenToken",result.data.refreshtokenToken)
            sessionStorage.setItem("refreshTokenEndAt",result.data.refreshTokenEndAt)
            sessionStorage.setItem("Permissions",result.data.permissions.toString())
            sessionStorage.setItem("Roles",result.data.roles.toString())
            sessionStorage.setItem("Clinics",JSON.stringify(result.data.clinics))
            sessionStorage.setItem("SelectedClinic",this.selectedClinicId?.toString()!)

             if(result.data.roles.includes("SuperAdmin")){
             this.router.navigateByUrl("/SuperAdmin");
             }
                      

            if(!result.data.roles.includes("SuperAdmin")){
               this.router.navigateByUrl("/Clinic");
            } 

          
        }
        
    })
  }


    logout(): void {

        // this.authService.logout();

        this.router.navigate(['/auth/login']);
    }

}
