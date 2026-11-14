import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import{AppService} from './app.service'
//Routes
import { routes } from './app.route';

import { AppComponent } from './app.component';

// store
import { StoreModule } from '@ngrx/store';
import {indexReducer} from './store/index.reducer'
// shared module

// i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './Common/Interceptors/auth-interceptor-interceptor';
import { AppLayout } from './Common/layouts/app-layout';
import { SidebarComponent } from './Common/layouts/sidebar';
import { IconModule } from './Common/shared/icon/icon.module';
import { NgScrollbar } from 'ngx-scrollbar';
import { HeaderComponent } from './Common/layouts/header';
import { MenuModule } from 'headlessui-angular';
import { LoadingInterceptor } from './Common/Interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
// AOT compilation support
export function HttpLoaderFactory(httpHandler: HttpBackend): TranslateHttpLoader {
    return new TranslateHttpLoader(new HttpClient(httpHandler));
}


@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        IconModule,
        NgScrollbar,
        MenuModule,
        StoreModule.forRoot({ index: indexReducer }),
        HttpClientModule,
        NgxSpinnerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend],
            },
        }),
    ],
    declarations: [
        AppLayout,
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        
        
        
    
    ],

    providers: [Title,AppService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
    }
],
    bootstrap: [AppComponent],
})
export class AppModule {}
