import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { toggleAnimation } from 'src/app/common/shared/animations';


@Component({
  selector: 'app-signup',
  animations: [toggleAnimation],
  templateUrl: './sign-up.component.html',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
 
  isOpen = false;
  showPassword = false;
  isSubmitting = false;
  errorMessage = '';
     store: any;
/**
 *
 */
    constructor(
        public translate: TranslateService,
        public storedata: Store<any>,
        public router: Router,
        private appSetting: AppService,
        private Route:Router
    ) {
        this.initStore();
    
    }
  RegisterForm: FormGroup = this.fb.group({
    FullName: ['', [Validators.required, Validators.minLength(3)]],
    Email: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(8)]],
    AcceptTerms: [false, [Validators.requiredTrue]],
  });


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

  onSubmit(): void {
    this.errorMessage = '';

    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.RegisterForm.value;

    // محاكاة مؤقتة لحين ربط الـ API
    setTimeout(() => {
      this.isSubmitting = false;
      console.log('Signup data:', formData);
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
}