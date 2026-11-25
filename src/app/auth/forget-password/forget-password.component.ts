import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
// استبدل المسار التالي بمسار الـ AuthService أو Store الخاص بك
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forget-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  public translate = inject(TranslateService);
  // private authService = inject(AuthService);

  ForgotForm: FormGroup = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
  });

  isSubmitting = false;
  emailSent = false;
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.emailSent = false;

    if (this.ForgotForm.invalid) {
      this.ForgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.ForgotForm.value.Email;

    // مثال على الاستدعاء الفعلي للـ API:
    // this.authService
    //   .forgotPassword({ email })
    //   .pipe(finalize(() => (this.isSubmitting = false)))
    //   .subscribe({
    //     next: () => {
    //       this.emailSent = true;
    //     },
    //     error: (err) => {
    //       this.errorMessage = err?.error?.message || 'حدث خطأ أثناء إرسال رابط الاستعادة.';
    //     },
    //   });

    // محاكاة مؤقتة لحين ربط الـ API
    setTimeout(() => {
      this.isSubmitting = false;
      this.emailSent = true;
      console.log('Forgot password requested for:', email);
    }, 1000);
  }
}