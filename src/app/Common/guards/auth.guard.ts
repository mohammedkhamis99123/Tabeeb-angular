import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = Boolean(sessionStorage.getItem('token')); // replace with your auth service

  if (isAuthenticated) {
    return true;
  }



  // استبدل هذا بطريقة قراءة الـ role من AuthService أو الـ Token عندك
  const userRole = sessionStorage.getItem('Roles');
  const allowedRoles = (route.data['roles'] as string[] | undefined) ?? [];

  if (!userRole) {
    return router.createUrlTree(['/Login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return true;
  }

  // لو مش مسموح له بالـ role ده، وجّهه لصفحة غير مصرح بها أو الرئيسية
  return router.createUrlTree(['/unauthorized']);
};