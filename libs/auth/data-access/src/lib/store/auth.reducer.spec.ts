import { login, loginFailure, loginSuccess, logout } from './auth.actions';
import { authReducer, AuthState } from './auth.reducer';

describe('authReducer', () => {
  const unauthenticatedState: AuthState = {
    isAuthenticated: false,
    error: null,
  };

  it('clears an old error when login starts', () => {
    const state = authReducer(
      { ...unauthenticatedState, error: 'Invalid username or password' },
      login({ username: 'admin', password: 'admin' }),
    );

    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('marks the user authenticated after login succeeds', () => {
    expect(authReducer(unauthenticatedState, loginSuccess())).toEqual({
      isAuthenticated: true,
      error: null,
    });
  });

  it('stores login failures', () => {
    expect(
      authReducer(
        unauthenticatedState,
        loginFailure({ error: 'Invalid username or password' }),
      ),
    ).toEqual({
      isAuthenticated: false,
      error: 'Invalid username or password',
    });
  });

  it('clears authentication on logout', () => {
    expect(
      authReducer({ isAuthenticated: true, error: null }, logout()),
    ).toEqual(unauthenticatedState);
  });
});