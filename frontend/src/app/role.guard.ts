import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function check(role: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return !!localStorage.getItem('access') && user.role === role;
}

export const AdminGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (check('admin') || check('staff')) {
    return true;
  }

  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');

  return router.createUrlTree(['/login']);
};
