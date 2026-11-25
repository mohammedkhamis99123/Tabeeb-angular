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
import { TranslateService } from '@ngx-translate/core';

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
  private router = inject(Router);
  public translate = inject(TranslateService);

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