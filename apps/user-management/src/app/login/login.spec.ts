import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { login } from 'data-access';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  let dispatch: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideMockStore({
          initialState: { auth: { isAuthenticated: false, error: null } },
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatch = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('marks required fields as touched when submitted empty', () => {
    component.login();

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.loginForm.controls.username.touched).toBe(true);
    expect(component.loginForm.controls.password.touched).toBe(true);
  });

  it('dispatches login with valid credentials', () => {
    component.loginForm.setValue({ username: 'admin', password: 'admin' });

    component.login();

    expect(dispatch).toHaveBeenCalledWith(login({ username: 'admin', password: 'admin' }));
  });

  it('navigates to users when authentication succeeds', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');

    store.setState({ auth: { isAuthenticated: true, error: null } });
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/users']);
  });
});
