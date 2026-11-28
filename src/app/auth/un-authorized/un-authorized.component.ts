import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-un-authorized',

  templateUrl: './un-authorized.component.html',
  styleUrl: './un-authorized.component.css'
})
export class UnAuthorizedComponent {
  private location = inject(Location);
  store:any;
   translate = inject(TranslateService);
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
goBack(): void {
    this.location.back();
  }
}
