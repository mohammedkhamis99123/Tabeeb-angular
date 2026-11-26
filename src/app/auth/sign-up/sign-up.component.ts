import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { toggleAnimation } from 'src/app/common/shared/animations';
import { LoginService } from '../login/Services/login.service';
import { SignUp } from './models/SignUp.model';

@Component({
  selector: 'app-signup',
  animations: [toggleAnimation],
  templateUrl: './sign-up.component.html',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private AuthServ=inject(LoginService)

  isOpen = false;
  showPassword = false;
  isSubmitting = false;
  errorMessage = '';
  store: any;

  // حروف عربية ومسافات فقط
  private readonly arabicOnlyRegex = /^[\u0600-\u06FF\s]+$/;

  // حروف إنجليزية ومسافات فقط
  private readonly englishOnlyRegex = /^[a-zA-Z\s]+$/;

  // قواعد Microsoft Identity لـ UserName: حروف إنجليزية، أرقام، و - . _ @ +
  private readonly identityUserNameRegex = /^[a-zA-Z0-9\-._@+]+$/;

  // رقم جوال سعودي: 05xxxxxxxx أو +9665xxxxxxxx أو 9665xxxxxxxx أو 5xxxxxxxx
  private readonly saudiPhoneRegex = /^(?:\+?9665|05|5)[0-9]{8}$/;

  // كلمة مرور قوية: حرف كبير، حرف صغير، رقم، ورمز خاص (8 أحرف فأكثر)
  private readonly strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

  constructor(
    public translate: TranslateService,
    public storedata: Store<any>,
    public router: Router,
    private appSetting: AppService,
    private Route: Router
  ) {
    this.initStore();
  }

  RegisterForm: FormGroup = this.fb.group({
    ArName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        Validators.pattern(this.arabicOnlyRegex),
      ],
    ],
    EnName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        Validators.pattern(this.englishOnlyRegex),
      ],
    ],
    UserName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
        Validators.pattern(this.identityUserNameRegex),
      ],
    ],
    Email: [
      '',
      [
        Validators.required,
        Validators.maxLength(256),
        Validators.email,
      ],
    ],
    PhoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(this.saudiPhoneRegex),
      ],
    ],
    Password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(this.strongPasswordRegex),
      ],
    ],
    AcceptTerms: [false, [Validators.requiredTrue]],
  });

  get f() {
    return this.RegisterForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.RegisterForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
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

    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const raw = this.RegisterForm.value;

    const formData:SignUp = {
      arName: (raw.ArName as string).trim(),
      enName: (raw.EnName as string).trim(),
      userName: (raw.UserName as string).trim(),
      email: (raw.Email as string).trim(),
      phoneNumber: this.normalizeSaudiPhone(raw.PhoneNumber as string),
      password: raw.Password as string,
    };

    this.AuthServ.SignUp(formData).subscribe((result)=>{
      if(result.isSuccess){
      this.isSubmitting = false;
      console.log('Signup data:', formData);
      this.router.navigate(['/Login']);
      }
    })
  
  }

  private normalizeSaudiPhone(phone: string): string {
    const cleaned = phone.replace(/\D+/g, '');

    if (cleaned.startsWith('9665') && cleaned.length === 12) {
      return '+' + cleaned;
    }

    if (cleaned.startsWith('05') && cleaned.length === 10) {
      return '+966' + cleaned.slice(1);
    }

    if (cleaned.startsWith('5') && cleaned.length === 9) {
      return '+966' + cleaned;
    }

    return phone.trim();
  }
}