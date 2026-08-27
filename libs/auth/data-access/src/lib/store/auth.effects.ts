import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, tap } from 'rxjs';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      map(({ username, password }) => {
        const isValid = username === 'admin' && password === 'admin';

        return isValid
          ? loginSuccess()
          : loginFailure({ error: 'Invalid username or password' });
      }),
      tap((action) => {
        if (action.type === loginSuccess.type) {
          localStorage.setItem('isLoggedIn', 'true');
        }
      }),
      catchError(() => of(loginFailure({ error: 'Unable to sign in' }))),
    ),
  );

  readonly logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => localStorage.removeItem('isLoggedIn')),
      ),
    { dispatch: false },
  );
}