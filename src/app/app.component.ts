import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LoadingService } from './Common/Services/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit,OnDestroy{

      private destroy$ = new Subject<void>();



    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private spinner: NgxSpinnerService,
        private loadingService: LoadingService,
        
    ) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                }),
                filter((route) => route.outlet === 'primary'),
                switchMap((route) => {
                    return route.data.pipe(
                        map((routeData: any) => {
                            const title = routeData['title'];
                            return { title };
                        }),
                    );
                }),
                tap((data: any) => {
                    let title = data.title;
                    title = (title ? title + ' | ' : '') + 'Tabeeb Platform';
                    this.titleService.setTitle(title);
                }),
            )
            .subscribe();

            
    }

    
    ngOnInit(): void {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
