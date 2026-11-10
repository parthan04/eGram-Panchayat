
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  BehaviorSubject,
  throwError
} from 'rxjs';

import {
  catchError,
  filter,
  switchMap,
  take
} from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    
    if (req.url.includes('/api/token/refresh/')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('access');

    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          token &&
          !req.url.includes('/api/token/')
        ) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        this.logout();
        return throwError(() => new Error('Refresh token missing'));
      }

      return this.http.post<{ access: string }>(
        'http://127.0.0.1:8000/api/token/refresh/',
        { refresh }
      ).pipe(
        switchMap((response) => {
          localStorage.setItem('access', response.access);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access);

          return next.handle(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            })
          );
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => error);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) =>
        next.handle(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      )
    );
  }

  private logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
