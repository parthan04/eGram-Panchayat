import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access');

  if(token){
    return true;
  }

  return inject(Router).createUrlTree(['/login']);

};
