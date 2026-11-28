import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { toggleAnimation } from 'src/app/common/shared/animations';
import { AppService } from 'src/app/app.service';
import { LoginService } from './Services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILogin } from './Models/Login.model';
import { CurrentUserService } from 'src/app/common/services/current-user.service';

@Component({
  selector: 'app-login',
  animations: [toggleAnimation],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
     store: any;
     isOpen=false;
    currYear: number = new Date().getFullYear();
    showPassword = false;
    isSubmitting = false;
    LoginForm!: FormGroup<{ Email: FormControl<string | null>; Password: FormControl<string | null>; RememberMe: FormControl<boolean | null>; }>;
    returnUrl: any;
    constructor(
        public translate: TranslateService,
        public storedata: Store<any>,
        public router: Router,
        private actRoute:ActivatedRoute,
        private appSetting: AppService,
        private LoginService:LoginService,
        private Route:Router,
        private currentUserService:CurrentUserService
    ) {
        this.initStore();
        this.initializeForm();
    
    }

    ngOnInit() {
    const url = this.actRoute.snapshot.queryParamMap.get('returnUrl');
    // تأكد إنه مسار داخلي يبدأ بـ "/" ولا يبدأ بـ "//" لتفادي Open Redirect
    if (url && url.startsWith('/') && !url.startsWith('//')) {
      this.returnUrl = url;
    }
  }
    initializeForm() {
    this.LoginForm=new FormGroup({
            Email:new FormControl('',[Validators.required,Validators.email]),
            Password:new FormControl('',[Validators.required]),
            RememberMe:new FormControl(true)
        })
    }
    async initStore() {
        this.storedata
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });

            console.log(this.store.languageList);
            
    }
    changeLanguage(item: any) {
        this.translate.use(item);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storedata.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storedata.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }

    onSubmit(){
        var val=this.LoginForm.value as ILogin
        this.LoginService.Login(val).subscribe(result=>{
            if(result.isSuccess){
                 this.currentUserService.isLoggedIn.next(true);
                    sessionStorage.setItem("Token",result.data.token)
                    sessionStorage.setItem("TokenEndAt",result.data.tokenEndAt)
                    sessionStorage.setItem("refreshtokenToken",result.data.refreshtokenToken)
                    sessionStorage.setItem("refreshTokenEndAt",result.data.refreshTokenEndAt)
                    sessionStorage.setItem("Permissions",result.data.permissions.toString())
                    sessionStorage.setItem("Roles",result.data.roles.toString())
                    sessionStorage.setItem("Clinics",JSON.stringify(result.data.clinics))
                    sessionStorage.setItem("SelectedClinic",result.data.clinicID!)
                      
                   if(result.data.redirectToChooseClinic){
                       this.router.navigateByUrl("/SelectClinic");

                   }
                    if(!result.data.redirectToChooseClinic){
                        if(result.data.roles.includes("SuperAdmin")){
                        this.router.navigateByUrl("/SuperAdmin");
                     }  

                     if(!result.data.roles.includes("SuperAdmin")){
                        this.router.navigateByUrl("/Clinic");
                     } 

                        if(!result.data.roles.includes("Customer")){
                        this.router.navigateByUrl(this.returnUrl);
                     } 
                    }
                    


                
            }
        })
    }

  
}


