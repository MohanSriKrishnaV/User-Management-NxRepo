import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, firstValueFrom, take } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

describe('AuthEffects', () => {
  let actions$: Observable<unknown>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthEffects, provideMockActions(() => actions$)],
    });
    effects = TestBed.inject(AuthEffects);
    localStorage.clear();
  });

  it('accepts the mock admin credentials', async () => {
    actions$ = new Observable((subscriber) => {
      subscriber.next(login({ username: 'admin', password: 'admin' }));
    });

    await expect(firstValueFrom(effects.login$.pipe(take(1)))).resolves.toEqual(loginSuccess());
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('rejects invalid credentials', async () => {
    actions$ = new Observable((subscriber) => {
      subscriber.next(login({ username: 'user', password: 'wrong' }));
    });

    await expect(firstValueFrom(effects.login$.pipe(take(1)))).resolves.toEqual(
      loginFailure({ error: 'Invalid username or password' }),
    );
  });

  it('clears local storage on logout', async () => {
    localStorage.setItem('isLoggedIn', 'true');
    actions$ = new Observable((subscriber) => subscriber.next(logout()));

    await firstValueFrom(effects.logout$.pipe(take(1)));
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });
});