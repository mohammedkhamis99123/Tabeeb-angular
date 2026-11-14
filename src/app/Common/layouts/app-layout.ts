import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '../../app.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from '../services/loading.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app-layout.html',
})
export class AppLayout {
    store: any;
    showTopButton = false;
     private destroy$ = new Subject<void>();
    constructor(public translate: TranslateService
        , public storeData: Store<any>
        , private service: AppService
        , private router: Router
        , private spinner: NgxSpinnerService,
        private loadingService: LoadingService,) {
        this.initStore();
    }
    headerClass = '';
    ngOnInit() {
        //this.initAnimation();
        //this.toggleLoader();
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                this.showTopButton = true;
            } else {
                this.showTopButton = false;
            }
        });
                this.loadingService.loading$
                .pipe(takeUntil(this.destroy$))
                .subscribe(isLoading => {
    
                    if (isLoading) {
                        this.spinner.show();
                    } else {
                        this.spinner.hide();
                    }
    
                });
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', () => {});
          this.destroy$.next();
            this.destroy$.complete();
    }

     
 

    /*initAnimation() {
        this.service.changeAnimation();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.service.changeAnimation();
            }
        });

        const ele: any = document.querySelector('.animation');
        ele.addEventListener('animationend', () => {
            this.service.changeAnimation('remove');
        });
    }

    toggleLoader() {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
        setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
        }, 500);
    }*/

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    goToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}
