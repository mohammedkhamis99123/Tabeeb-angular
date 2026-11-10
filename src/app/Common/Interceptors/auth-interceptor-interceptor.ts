

import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take,
  finalize
} from 'rxjs';

import { LoginService } from 'src/app/auth/login/Services/login.service';
import SWal from 'sweetalert2';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const token = sessionStorage.getItem('Token');

    const clonedReq = token
      ? this.addTokenHeader(request, token)
      : request;

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // لو الخطأ 401، جرّب تجديد الـ Token
        if (
          error.status === 401 &&
          !request.url.includes('Auth/Login') &&
          !request.url.includes('Auth/RefreshToken')
        ) {
          return this.handle401Error(clonedReq, next).pipe(
            catchError((refreshError: HttpErrorResponse) => {
              this.showToastError(refreshError);
              return throwError(() => refreshError);
            })
          );
        }

        // باقي الأخطاء
        this.showToastError(error);

        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const loginService = this.injector.get(LoginService);

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return loginService.refreshToken().pipe(
        switchMap((response: any) => {
          const newToken = response.data.token;
          const newRefreshToken = response.data.refreshtokenToken;

          sessionStorage.setItem('Token', newToken);
          sessionStorage.setItem('refreshtokenToken', newRefreshToken);

          this.refreshTokenSubject.next(newToken);

          return next.handle(
            this.addTokenHeader(request, newToken)
          );
        }),
        catchError((error: HttpErrorResponse) => {
          // فشل تجديد الـ Token
          this.refreshTokenSubject.error(error);
          sessionStorage.removeItem('Token');
          sessionStorage.removeItem('refreshtokenToken');

          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token =>
        next.handle(this.addTokenHeader(request, token))
      )
    );
  }

private showToastError(error: HttpErrorResponse): void {
  const body = error.error;

  let message: string =
    body?.message ||
    body?.Message ||
    'حدث خطأ غير متوقع';

  // قراءة أخطاء الـ Validation القادمة من السيرفر
  if (body?.errors || body?.Errors) {
    const errors = body.errors || body.Errors;

    const validationMessages = Array.isArray(errors)
      ? errors
      : Object.values(errors).flat();

    if (validationMessages.length > 0) {
      message += '\n' + validationMessages.join('\n');
    }
  }

Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'error',
  title: message,
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
    customClass: {
            popup: `color-danger`
          },
});
}
}
