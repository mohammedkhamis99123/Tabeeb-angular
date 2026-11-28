import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { LoginService } from '../login/Services/login.service';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/app.service';
// استبدل المسار التالي بمسار الـ AuthService أو Store الخاص بك
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forget-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  public translate = inject(TranslateService);
  private auth = inject(LoginService);

  ForgotForm: FormGroup = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
  });
  store:any
  isSubmitting = false;
  emailSent = false;
  errorMessage = '';
  constructor(public storedata: Store<any>,
      public router: Router,
      private appSetting: AppService) {
   this.initStore()

  }

  async initStore() {
    this.storedata
      .select((d) => d.index)
      .subscribe((d) => {
        this.store = d;
      });

    console.log(this.store?.languageList);
  }

  changeLanguage(item: any) {
    this.translate.use(item);
    this.appSetting.toggleLanguage(item);
    if (this.store?.locale?.toLowerCase() === 'ae') {
      this.storedata.dispatch({ type: 'toggleRTL', payload: 'rtl' });
    } else {
      this.storedata.dispatch({ type: 'toggleRTL', payload: 'ltr' });
    }
    window.location.reload();
  }
  onSubmit(): void {
    this.errorMessage = '';
    this.emailSent = false;

    if (this.ForgotForm.invalid) {
      this.ForgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.ForgotForm.value.Email;

   
     this.auth
       .ForgetPassword( email )
       .pipe(finalize(() => (this.isSubmitting = false)))
       .subscribe({
         next: () => {
           this.emailSent = true;
         },
         error: (err) => {
           this.errorMessage = err?.error?.message || 'حدث خطأ أثناء إرسال رابط الاستعادة.';
         },
       });

    // محاكاة مؤقتة لحين ربط الـ API
  
  }
}