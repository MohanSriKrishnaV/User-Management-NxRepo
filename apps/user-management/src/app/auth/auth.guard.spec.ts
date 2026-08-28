import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  function configureGuard(isAuthenticated: boolean): void {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { auth: { isAuthenticated, error: null } },
        }),
        provideRouter([]),
      ],
    });
  }

  it('allows authenticated users', async () => {
    configureGuard(true);

    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>,
      ),
    );

    expect(result).toBe(true);
  });

  it('redirects unauthenticated users to login', async () => {
    configureGuard(false);

    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<
          boolean | ReturnType<Router['createUrlTree']>
        >,
      ),
    );
    const router = TestBed.inject(Router);

    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});
