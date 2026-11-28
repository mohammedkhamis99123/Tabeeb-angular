import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('Password')?.value;
  const confirmPassword = control.get('ConfirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);

store:any
  constructor(public storedata: Store<any>,
      public router: Router,
      private appSetting: AppService) {
   this.initStore()

  }

  

  ResetForm: FormGroup = this.fb.group(
    {
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  token: string | null = null;
  email: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
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
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.ResetForm.invalid) {
      this.ResetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      email: this.email,
      token: this.token,
      password: this.ResetForm.value.Password,
      confirmPassword: this.ResetForm.value.ConfirmPassword,
    };

    // محاكاة مؤقتة لحين ربط الـ API
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'تم تحديث كلمة المرور بنجاح. جاري تحويلك لتسجيل الدخول...';
      console.log('Reset password payload:', payload);

      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    }, 1000);
  }
}